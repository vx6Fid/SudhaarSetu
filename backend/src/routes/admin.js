const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Creating an Organization
router.post(
  "/admin/create-organization",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const {
      name,
      description,
      email,
      contact,
      logo_url,
      categories = [],
      wards = [],
    } = req.body;

    try {
      // Check if organization already exists
      const existingOrg = await pool.query(
        "SELECT * FROM organizations WHERE name = $1",
        [name]
      );
      if (existingOrg.rows.length > 0) {
        return res
          .status(400)
          .json({ error: "Organization Name already exists" });
      }

      // Insert organization
      const newOrg = await pool.query(
        `INSERT INTO organizations 
                (name, description, email, contact, logo_url, categories, wards, admin_id)
             VALUES 
                ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
        [
          name,
          description,
          email,
          contact,
          logo_url,
          categories,
          wards,
          req.user.id,
        ]
      );

      // Assign the organization to the admin
      const assignOrg = await pool.query(
        "UPDATE admins SET org_name = $1, org_id = $2 WHERE id = $3 RETURNING *",
        [name, newOrg.rows[0].id, req.user.id]
      );

      res.status(201).json({
        message: "Organization created successfully",
        organization: newOrg.rows[0],
        admin: assignOrg.rows[0],
      });
    } catch (err) {
      console.error("Error creating organization:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Fetching Organizations
router.get("/admin/organizations", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM organizations;");
    // Return only the rows
    return res.status(200).json({
      success: true,
      count: result.rowCount,
      organizations: result.rows,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching organizations.",
    });
  }
});

// Fetching org details
router.post("/organizations", async (req, res) => {
  const { org_name } = req.body;

  if (!org_name) {
    return res.status(400).json({ error: "Missing org_name in request body" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM organizations WHERE name = $1",
      [org_name.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Organization not found" });
    }

    return res.status(200).json({
      success: true,
      organization: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching organization.",
    });
  }
});

// Field Officer & Call Center Login
router.post("/officer/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const officer = await pool.query(
      "SELECT * FROM officers WHERE email = $1",
      [email]
    );
    if (officer.rows.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, officer.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: officer.rows[0].id,
        role: officer.rows[0].role,
        city: officer.rows[0].city,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, officer: officer.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin Removing a Field Officer or Call Center Staff
router.delete(
  "/admin/remove-user/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      // Delete the officer
      const deletedUser = await pool.query(
        "DELETE FROM officers WHERE id = $1 RETURNING *",
        [id]
      );

      if (deletedUser.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      // Decrement officer count in the organization
      const officerCountUpdate = await pool.query(
        "UPDATE organizations SET officers = officers - 1 WHERE admin_id = $1 RETURNING officers",
        [req.user.id]
      );

      if (officerCountUpdate.rowCount === 0) {
        return res.status(400).json({
          error: "Organization not found or officer count update failed",
        });
      }

      return res.status(200).json({
        message: "User removed successfully",
        officerCount: officerCountUpdate.rows[0].officer,
      });
    } catch (err) {
      console.error("Error removing user:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);

// Create Field Officer
router.post(
  "/admin/create-officer",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const {
      name,
      email,
      password,
      phone,
      address,
      role,
      ward,
      city,
      state,
      organization_name,
    } = req.body;

    if (!["field_officer", "call_center"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    let client;

    try {
      // Check if the user already exists
      const existingUser = await pool.query(
        "SELECT * FROM officers WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Get client and start transaction
      client = await pool.connect();
      await client.query("BEGIN");

      // Insert the new user
      const newUser = await client.query(
        `INSERT INTO officers 
            (name, email, password, phone, address, role, city, state, ward, org_name, admin_id) 
           VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
           RETURNING *`,
        [
          name,
          email,
          hashedPassword,
          phone,
          address,
          role,
          city,
          state,
          ward,
          organization_name,
          req.user.id,
        ]
      );

      // Update officer count in organization
      const assignOfficerCount = await client.query(
        `UPDATE organizations 
           SET officers = officers + 1 
           WHERE admin_id = $1 
           RETURNING officers`,
        [req.user.id]
      );

      await client.query("COMMIT");

      res.status(201).json({
        message: "User created successfully",
        user: newUser.rows[0],
        officer: assignOfficerCount.rows[0].officers,
      });
    } catch (err) {
      if (client) await client.query("ROLLBACK");
      console.error("Transaction failed:", err);
      res.status(500).json({ error: "Server error during user creation" });
    } finally {
      if (client) client.release();
    }
  }
);

// Admin Assigning a Field Officer to a Complaint
router.post("/admin/assign-field-officer", authMiddleware, async (req, res) => {
  const { admin_id, complaint_id, field_officer_id, officerName } = req.body;

  // Validate required fields
  if (!admin_id || !complaint_id || !field_officer_id) {
    return res.status(400).json({
      error: "admin_id, complaint_id, and field_officer_id are required",
    });
  }

  try {
    // Verify that the admin exists
    const adminCheck = await pool.query("SELECT id FROM admins WHERE id = $1", [
      admin_id,
    ]);
    if (adminCheck.rows.length === 0) {
      return res
        .status(403)
        .json({ error: "Unauthorized: Admin does not exist" });
    }

    // Check if the complaint exists
    const complaintCheck = await pool.query(
      "SELECT id, field_officer_id FROM complaints WHERE id = $1",
      [complaint_id]
    );
    if (complaintCheck.rows.length === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Check if the field officer exists
    const officerCheck = await pool.query(
      "SELECT id FROM officers WHERE id = $1 AND role = 'field_officer'",
      [field_officer_id]
    );
    if (officerCheck.rows.length === 0) {
      return res.status(400).json({ error: "Invalid field officer ID" });
    }

    // Check if the complaint is already assigned
    if (complaintCheck.rows[0].field_officer_id) {
      return res
        .status(400)
        .json({ error: "Complaint already assigned to a field officer" });
    }

    // Assign the field officer to the complaint
    const updateQuery = `
            UPDATE complaints 
            SET field_officer_id = $1, officer_name = $2
            WHERE id = $3 
            RETURNING id, field_officer_id
        `;
    const result = await pool.query(updateQuery, [
      field_officer_id,
      officerName,
      complaint_id,
    ]);

    res.json({
      message: "Field officer assigned successfully",
      complaint: result.rows[0],
    });
  } catch (error) {
    console.error("Assignment error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetching Field Officers
router.get("/officers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM officers;");

    // Return only the rows
    return res.status(200).json({
      success: true,
      count: result.rowCount,
      officers: result.rows,
    });
  } catch (error) {
    console.error("Error fetching officers:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching officers.",
    });
  }
});

module.exports = router;

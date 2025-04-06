const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const jwt = require("jsonwebtoken");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Login
router.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
        if (admin.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        

        const token = jwt.sign(
            { id: admin.rows[0].id, role: "admin", city: admin.rows[0].city },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, admin: admin.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Field Officer & Call Center Login
router.post("/officer/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const officer = await pool.query("SELECT * FROM officers WHERE email = $1", [email]);
        if (officer.rows.length === 0) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, officer.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: officer.rows[0].id, role: officer.rows[0].role, city: officer.rows[0].city },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ token, officer: officer.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Admin Removing a Field Officer or Call Center Staff
router.delete("/admin/remove-user/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await pool.query("DELETE FROM officers WHERE id = $1 RETURNING *", [id]);

        if (deletedUser.rowCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "User removed successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Create Field Officer or Call Center Staff  
router.post("/admin/create-user", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {  
    const { name, email, password, phone, address, role, ward, city, state } = req.body;  

    if (!["field_officer", "call_center"].includes(role)) {  
        return res.status(400).json({ error: "Invalid role" });  
    }  

    try {  
        // Check if the user already exists  
        const existingUser = await pool.query("SELECT * FROM officers WHERE email = $1", [email]);  
        if (existingUser.rows.length > 0) {  
            return res.status(400).json({ error: "User already exists" });  
        }  

        // Hashing the password  
        const salt = await bcrypt.genSalt(10);  
        const hashedPassword = await bcrypt.hash(password, salt);  

        // Inserting the new user with city and state  
        const newUser = await pool.query(  
            "INSERT INTO officers (name, email, password, phone, address, role, city, state, ward) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",  
            [name, email, hashedPassword, phone, address, role, city, state, ward]  
        );  

        res.status(201).json({ message: "User created successfully", user: newUser.rows[0] });  
    } catch (err) {  
        console.error(err);  
        res.status(500).json({ error: "Server error" });  
    }  
});  

router.post("/admin/assign-field-officer", async (req, res) => {
    const { admin_id, complaint_id, field_officer_id, officerName } = req.body;

    // Validate required fields
    if (!admin_id || !complaint_id || !field_officer_id) {
        return res.status(400).json({ error: "admin_id, complaint_id, and field_officer_id are required" });
    }

    try {
        // Verify that the admin exists
        const adminCheck = await pool.query("SELECT id FROM admins WHERE id = $1", [admin_id]);
        if (adminCheck.rows.length === 0) {
            return res.status(403).json({ error: "Unauthorized: Admin does not exist" });
        }

        // Check if the complaint exists
        const complaintCheck = await pool.query("SELECT id, field_officer_id FROM complaints WHERE id = $1", [complaint_id]);
        if (complaintCheck.rows.length === 0) {
            return res.status(404).json({ error: "Complaint not found" });
        }

        // Check if the field officer exists
        const officerCheck = await pool.query("SELECT id FROM officers WHERE id = $1 AND role = 'field_officer'", [field_officer_id]);
        if (officerCheck.rows.length === 0) {
            return res.status(400).json({ error: "Invalid field officer ID" });
        }

        // Check if the complaint is already assigned
        if (complaintCheck.rows[0].field_officer_id) {
            return res.status(400).json({ error: "Complaint already assigned to a field officer" });
        }

        // Assign the field officer to the complaint
        const updateQuery = `
            UPDATE complaints 
            SET field_officer_id = $1, officer_name = $2
            WHERE id = $3 
            RETURNING id, field_officer_id
        `;
        const result = await pool.query(updateQuery, [field_officer_id, officerName, complaint_id]);

        res.json({ message: "Field officer assigned successfully", complaint: result.rows[0] });

    } catch (error) {
        console.error("Assignment error:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// Fetching Field Officers
router.get('/officers', async (req, res) => {
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

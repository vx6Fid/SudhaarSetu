const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");
require("dotenv").config();

const upload = multer();

// Create-Complaint
router.post("/complaint", authMiddleware, async (req, res) => {
  const { category, location, image, ward_no, city, state } = req.body;
  const user_id = req.user?.user;

  try {
    // Check for duplicate complaints (same location & category)
    const duplicateCheck = await pool.query(
      "SELECT * FROM complaints WHERE category = $1 AND location = $2 AND ward_no = $3 AND city = $4 AND status IN ('pending', 'in_progress')",
      [category, location, ward_no, city]
    );

    if (duplicateCheck.rows.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "A complaint already exists for this issue in the same location.",
        });
    }

    // Insert Complaint (Corrected)
    const newComplaint = await pool.query(
      `INSERT INTO complaints 
            (user_id, category, location, image, status, ward_no, city, "State", upvotes, views, total_comments, comments) 
            VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, 0, 0, 0, NULL::UUID) 
            RETURNING *`,
      [user_id, category, location, image, ward_no, city, state]
    );

    res
      .status(201)
      .json({
        message: "Complaint created successfully",
        complaint: newComplaint.rows[0],
      });
  } catch (err) {
    console.error("Database Insert Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Update complaint status & upload proof image
router.put(
  "/complaints/:id/status",
  authMiddleware,
  roleMiddleware(["field_officer"]),
  upload.single("proof"),
  async (req, res) => {
    const fieldOfficerId = req.user.id;
    const complaintId = req.params.id;
    const { status } = req.body;

    try {
      const complaint = await pool.query(
        "SELECT * FROM complaints WHERE id = $1",
        [complaintId]
      );
      if (!complaint.rows.length)
        return res.status(404).json({ error: "Complaint not found" });

      const currentStatus = complaint.rows[0].status;

      if (complaint.rows[0].field_officer_id !== fieldOfficerId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      if (currentStatus === "pending" && status !== "in_progress") {
        return res
          .status(400)
          .json({ error: "Complaint must move to 'in_progress' first." });
      }
      if (currentStatus === "in_progress" && status !== "resolved") {
        return res
          .status(400)
          .json({
            error: "Complaint must move to 'resolved' from 'in_progress' only.",
          });
      }

      let proofImageUrl = null;
      if (status === "resolved" && req.file) {
        const form = new FormData();
        form.append("source", req.file.buffer, {
          filename: req.file.originalname,
        });
        form.append("key", process.env.FREEIMAGE_API_KEY);
        form.append("action", "upload");
        form.append("format", "json");

        const response = await fetch("https://freeimage.host/api/1/upload", {
          method: "POST",
          body: form,
          headers: form.getHeaders(),
        });

        const data = await response.json();
        if (response.ok && data.status_code === 200) {
          proofImageUrl = data.image.url;
        } else {
          return res.status(500).json({ error: "Image upload failed" });
        }
      }

      await pool.query(
        "UPDATE complaints SET status = $1, resolved_image = $2 WHERE id = $3",
        [status, proofImageUrl, complaintId]
      );

      res.json({ message: "Status updated successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Accept complaint (Assign field officer)
router.put(
  "/complaints/:id/accept",
  authMiddleware,
  roleMiddleware(["field_officer"]),
  async (req, res) => {
    const fieldOfficerId = req.user.id;
    const complaintId = req.params.id;
    const officer_name = req.user.name;

    try {
      const complaint = await pool.query(
        "SELECT * FROM complaints WHERE id = $1",
        [complaintId]
      );
      if (!complaint.rows.length)
        return res.status(404).json({ error: "Complaint not found" });

      // Ensure complaint is not already assigned
      if (complaint.rows[0].assigned_officer) {
        return res
          .status(400)
          .json({
            error: "Complaint is already assigned to another field officer.",
          });
      }

      // Assign the field officer
      await pool.query(
        "UPDATE complaints SET field_officer_id = $1, officer_name = $2 WHERE id = $3",
        [fieldOfficerId, officer_name, complaintId]
      );

      res.json({ message: "You have been assigned to this complaint." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Fetch complaints by ward, city, or assigned officer
router.get("/complaints", async (req, res) => {
  const { ward, city, officer, category, complaint_id } = req.query;
  let query = "SELECT * FROM complaints WHERE 1=1";
  const values = [];
  let count = 1; // Placeholder index

  if (ward) {
    query += ` AND ward_no = $${count}`;
    values.push(ward);
    count++;
  }
  if (category) {
    query += ` AND category = $${count}`;
    values.push(category);
    count++;
  }
  if (complaint_id) {
    query += ` AND complaint_id = $${count}`;
    values.push(complaint_id);
    count++;
  }
  if (city) {
    query += ` AND city = $${count}`;
    values.push(city);
    count++;
  }
  if (officer) {
    query += ` AND field_officer_id = $${count}`;
    values.push(officer);
    count++;
  }

  try {
    const complaints = await pool.query(query, values);
    res.json({ complaints: complaints.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch Complaint by Complaint ID
router.get("/complaint/:complaint_id", async (req, res) => {
  const { complaint_id } = req.params; // Corrected param name

  if (!complaint_id) {
    return res.status(400).json({ error: "Complaint ID is required" });
  }

  try {
    const query = "SELECT * FROM complaints WHERE id = $1";
    const values = [complaint_id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({ complaint: result.rows[0] }); // Return single complaint object, not an array
  } catch (error) {
    console.error("Error fetching complaint:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch complaints by user_id
router.get("/user/complaints", async (req, res) => {
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const query =
      "SELECT * FROM complaints WHERE user_id = $1 ORDER BY created_at DESC";
    const result = await pool.query(query, [user_id]);

    res.json({ complaints: result.rows });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

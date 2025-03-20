const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware"); // For proof image uploads


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
            return res.status(400).json({ error: "A complaint already exists for this issue in the same location." });
        }

        // Insert Complaint (Corrected)
        const newComplaint = await pool.query(
            `INSERT INTO complaints 
            (user_id, category, location, image, status, ward_no, city, "State", upvotes, views, total_comments, comments) 
            VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7, 0, 0, 0, NULL::UUID) 
            RETURNING *`,
            [user_id, category, location, image, ward_no, city, state]
        );
        
        res.status(201).json({ message: "Complaint created successfully", complaint: newComplaint.rows[0] });
    } catch (err) {
        console.error("Database Insert Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});


// Toggle upvote on a complaint
router.post("/complaints/:id/upvote", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const complaintId = req.params.id;
    
    try {
        // Check if user already upvoted
        const upvoteCheck = await pool.query(
            "SELECT * FROM complaint_upvotes WHERE user_id = $1 AND complaint_id = $2", 
            [userId, complaintId]
        );
        
        if (upvoteCheck.rows.length > 0) {
            // Remove upvote (toggle off)
            await pool.query("DELETE FROM complaint_upvotes WHERE user_id = $1 AND complaint_id = $2", [userId, complaintId]);
            await pool.query("UPDATE complaints SET upvotes = upvotes - 1 WHERE id = $1", [complaintId]);
            return res.json({ message: "Upvote removed." });
        }
        
        // Add upvote
        await pool.query("INSERT INTO complaint_upvotes (user_id, complaint_id) VALUES ($1, $2)", [userId, complaintId]);
        await pool.query("UPDATE complaints SET upvotes = upvotes + 1 WHERE id = $1", [complaintId]);
        
        res.json({ message: "Complaint upvoted." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Add a comment
router.post("/complaints/:id/comment", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const complaintId = req.params.id;
    const { description } = req.body;
    
    try {
        const newComment = await pool.query(
            "INSERT INTO comments (user_id, complaint_id, comment_text, likes_count, views_count, created_at) VALUES ($1, $2, $3, 0, 0, NOW()) RETURNING *", 
            [userId, complaintId, description]
        );
        
        await pool.query("UPDATE complaints SET total_comments = total_comments + 1 WHERE id = $1", [complaintId]);
        res.json({ message: "Comment added.", comment: newComment.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update complaint status & upload proof image
router.put("/complaints/:id/status", authMiddleware, roleMiddleware(["field_officer"]), upload.single("proof"), async (req, res) => {
    const fieldOfficerId = req.user.id;
    const complaintId = req.params.id;
    const { status } = req.body;
    const proofImage = req.file ? req.file.path : null;
    
    try {
        const complaint = await pool.query("SELECT * FROM complaints WHERE id = $1", [complaintId]);
        if (!complaint.rows.length) return res.status(404).json({ error: "Complaint not found" });
        
        // Ensure officer is assigned
        if (complaint.rows[0].assigned_officer !== fieldOfficerId) {
            return res.status(403).json({ error: "Unauthorized" });
        }
        
        // If resolving, proof image is required
        if (status === "resolved" && !proofImage) {
            return res.status(400).json({ error: "Proof image required" });
        }
        
        await pool.query(
            "UPDATE complaints SET status = $1, proof_image = $2 WHERE id = $3", 
            [status, proofImage, complaintId]
        );
        res.json({ message: "Status updated successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

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

module.exports = router;

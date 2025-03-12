const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcrypt");

// Fetch user details by user_id
router.get("/user", async (req, res) => {
    const { user_id, role } = req.query;
    
    if (!user_id || !role) {
        return res.status(400).json({ error: "user_id and role are required" });
    }
    
    let table = role === "citizen" ? "users" : role === "officer" ? "officers" : null;
    if (!table) {
        return res.status(400).json({ error: "Invalid role" });
    }
    
    try {
        const query = `SELECT * FROM ${table} WHERE id = $1`;
        const result = await pool.query(query, [user_id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        res.json({ user: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

// Update user details
router.put("/update-user", async (req, res) => {
    const { user_id, role, name, phone, city, ward, state, email, password } = req.body;

    // Validate required fields
    if (!user_id || !role) {
        return res.status(400).json({ error: "user_id and role are required" });
    }

    // Validate role (prevent SQL injection)
    const validRoles = ["citizen", "officer"];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
    }

    // Select the correct table
    const table = role === "citizen" ? "users" : role === "admin" ? "admins" : "officers";

    // Prepare updates dynamically
    let updates = [];
    let values = [];
    let count = 1;

    if (name) { updates.push(`name = $${count}`); values.push(name); count++; }
    if (phone) { updates.push(`phone = $${count}`); values.push(phone); count++; }
    if (city) { updates.push(`city = $${count}`); values.push(city); count++; }
    if (ward) { updates.push(`ward = $${count}`); values.push(ward || null); count++; } // Handle empty ward
    if (state) { updates.push(`state = $${count}`); values.push(state); count++; }
    if (email) { updates.push(`email = $${count}`); values.push(email); count++; }

    // Hash password securely
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updates.push(`password = $${count}`);
        values.push(hashedPassword);
        count++;
    }

    // Check if there are any fields to update
    if (updates.length === 0) {
        return res.status(400).json({ error: "No fields to update" });
    }

    values.push(user_id);

    try {
        // Run the update query
        const query = `UPDATE ${table} SET ${updates.join(", ")} WHERE id = $${count} RETURNING id, name, phone, city, ward, state, email`;
        const result = await pool.query(query, values);

        // Handle case where user doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return updated user details (excluding password)
        res.json({ message: "User updated successfully", user: result.rows[0] });

    } catch (error) {
        console.error("Update error:", error);

        // Handle unique email conflict
        if (error.code === "23505") {
            return res.status(400).json({ error: "Email already in use" });
        }

        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../config/db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// User Singup
router.post("/signup", async (req, res) => {
    const { name, email, password, phone, city, state, ward } = req.body;

    try {
        // Check if user already exists
        const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if(existingUser.rows.length > 0) {
            return res.status(401).json("User already exists");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        const newUser=  await pool.query(
            "INSERT INTO users (name, email, password, phone, city, state, ward) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [name, email, hashedPassword, phone, city, state, ward]
        );

        // Generate JWT token
        const token = jwt.sign({ user: newUser.rows[0].id }, JWT_SECRET);

        res.status(201).json({ token, user: newUser.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});


// User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if(user.rows.length === 0) {
            return res.status(401).json("Invalid Credentials");
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if(!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({ user: user.rows[0].id }, JWT_SECRET);

        res.status(200).json({ token, user: user.rows[0] });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error" });
    }
});

module.exports = router;
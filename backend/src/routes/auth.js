const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// User Signup
router.post("/user/signup", async (req, res) => {
  const { name, email, password, phone, city, state, ward, org_name } =
    req.body;

  let client;
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(401).json("User already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    client = await pool.connect();
    await client.query("BEGIN");

    // Insert new user into database
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, phone, city, state, ward, org_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, email, hashedPassword, phone, city, state, ward, org_name]
    );

    // Adding User to Organization
    const userCount = await pool.query(
      "UPDATE organizations SET users = users + 1 WHERE name = $1 RETURNING users",
      [org_name]
    );

    // Generate JWT token
    const token = jwt.sign({ user: newUser.rows[0].id }, JWT_SECRET);

    await client.query("COMMIT");

    res.status(201).json({
      message: "User created successfully!",
      token,
      user: newUser.rows[0],
    });
  } catch (error) {
    if (client) await client.query("ROLLBACK");
    console.error(error.message);
    res.status(500).json({ error: error.message });
  } finally {
    if (client) client.release();
  }
});

// User Login
router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credentials");
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
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

// Admin Registration
router.post("/admin/signup", async (req, res) => {
  const { name, email, password, address, phone, city, state } = req.body;

  try {
    // Check if admin already exists
    const existingAdmin = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );
    if (existingAdmin.rows.length > 0) {
      return res.status(401).json("Admin already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new admin into database
    const newAdmin = await pool.query(
      "INSERT INTO admins (name, email, password, phone, city, state, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, email, hashedPassword, phone, city, state, address]
    );

    res.status(201).json({
      messaage: "Admin created successfully",
      admin: newAdmin.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

// Admin Login
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);
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

module.exports = router;

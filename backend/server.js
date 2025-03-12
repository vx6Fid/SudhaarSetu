require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Pool } = require('pg');

const authRoutes = require("./src/routes/auth");
const adminRoutes = require("./src/routes/admin");
const complaintRoutes = require("./src/routes/complaints");
const userRoutes = require("./src/routes/user");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// PostgreSQL Connection
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('DB Connection Error:', err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", complaintRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", userRoutes);

// Test Route 
app.get('/', (req, res) => {
    res.json({message: "SudhaarSetu Backend is Running..."});
});

// Starting Server
const PORT  = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on ${PORT}`))

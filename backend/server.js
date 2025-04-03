require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./src/routes/auth");
const adminRoutes = require("./src/routes/admin");
const complaintRoutes = require("./src/routes/complaints");
const userRoutes = require("./src/routes/user");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", complaintRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", userRoutes);

// Test Route
app.get("/", (req, res) => {
res.json({ message: "SudhaarSetu Backend is Running..." });
});

// Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
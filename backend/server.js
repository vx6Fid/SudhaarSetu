require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");

const authRoutes = require("./src/routes/auth");
const adminRoutes = require("./src/routes/admin");
const complaintRoutes = require("./src/routes/complaints");
const userRoutes = require("./src/routes/user");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Multer for file uploads
const upload = multer();

app.use("/api/auth", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", complaintRoutes);
app.use("/api", userRoutes);

// Image Upload Route
app.post("/api/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const form = new FormData();
    form.append("source", req.file.buffer, { filename: req.file.originalname });
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
      return res.json({ imageUrl: data.image.url });
    } else {
      return res.status(500).json({ error: "Image upload failed" });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "SudhaarSetu Backend is Running..." });
});

// Starting Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

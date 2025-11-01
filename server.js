// server.js
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // Serve frontend HTML

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Cloudinary Upload Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // You can rename this folder
    // allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});
const upload = multer({ storage });

// app.get("/qrcode", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "qrCode.html"));
// });

// Upload Route
app.post("/api/upload", upload.array("images", 10), (req, res) => {
  try {
    const urls = req.files.map((file) => file.path);
    res.status(200).json({ message: "Uploaded successfully", images: urls });
  } catch (err) {
    console.log("error err", err)
    res.status(500).json({ error: "Upload failed" });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const FLASK_API_URL = "http://127.0.0.1:5000";

// Proxy route to fetch previous analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const response = await axios.post(`${FLASK_API_URL}/analyze`, {});
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching previous analysis:", error);
    res.status(500).json({ error: "Failed to fetch previous analysis results." });
  }
});

// Proxy route to analyze an uploaded image
app.post("/api/analyze/:category", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    const category = req.params.category;
    const formData = new FormData();
    formData.append("image", req.file.buffer, { filename: req.file.originalname });

    const response = await axios.post(`${FLASK_API_URL}/analyze/${category}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error analyzing image:", error);
    res.status(500).json({ error: "Failed to analyze image." });
  }
});

// Start Express server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; style-src 'self' https://cdnjs.cloudflare.com"
    );
    next();
  });
  
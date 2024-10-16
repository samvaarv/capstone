import express from "express";
import About from "../models/aboutModel.js";
const router = express.Router();

// Route to get about data
router.get("/about", async (req, res) => {
  try {
    const aboutData = await About.find(); // Assuming you only have one entry
    if (!aboutData || aboutData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No about data found." });
    }
    res.status(200).json({ success: true, about: aboutData });
  } catch (error) {
    console.error("Error fetching about data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});
export default router;

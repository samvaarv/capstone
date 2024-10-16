import express from "express";
import Portfolio from "../models/portfolioModel.js";
const router = express.Router();

// Get all portfolios (for users)
router.get("/portfolio", async (req, res) => {
    try {
      const portfolios = await Portfolio.find();
      res.status(200).json({ success: true, portfolios });
    } catch (error) {
      console.error("Error fetching portfolios:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

router.get("/portfolio/:id", async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio not found" });
    }
    res.status(200).json({ success: true, portfolio });
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
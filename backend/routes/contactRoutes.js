import express from "express";
import {
  getInquiries,
  sendInquiry,
  replyToInquiry,
} from "../controllers/contactController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

// Send inquiry (client-side)
router.post("/contact", sendInquiry);

// Get inquiries (admin-side)
router.get("/inquiries", verifyToken, requireAdmin, getInquiries);

// Reply to an inquiry (admin-side)
router.post("/contact/reply/:inquiryId", verifyToken, requireAdmin, replyToInquiry);

export default router;

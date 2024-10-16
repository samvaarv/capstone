import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";

const router = express.Router();

// Get notifications for a user
router.get("/notifications", verifyToken, getNotifications);

// Mark a notification as read
router.post("/notifications/:id/read", verifyToken, markNotificationAsRead);

export default router;

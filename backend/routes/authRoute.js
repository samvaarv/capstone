import express from "express";
import {
  login,
  logout,
  signup,
  verifyEmail,
  forgotPassword,
  resetPassword,
  checkAuth,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// Update user profile (name and image)
router.put("/update-profile", verifyToken, upload.single("profileImage"), updateProfile);

// Change password
router.put("/change-password", verifyToken, changePassword);

export default router;

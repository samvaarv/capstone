import express from "express";
import {
  createUserTestimonial,
  getUserTestimonials,
} from "../controllers/testimonialController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Client routes for testimonials
router.post("/testimonials", verifyToken, createUserTestimonial); // Create a testimonial
router.get("/client/testimonials", verifyToken, getUserTestimonials); // Get testimonials for the logged-in user

export default router;

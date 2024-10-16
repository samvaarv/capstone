import express from "express";
import { getHomepageContent } from "../controllers/homepageController.js";

const router = express.Router();

router.get("/homepage", getHomepageContent);

export default router;

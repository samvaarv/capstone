import express from "express";
import {
  addPortfolio,
  getPortfolios,
  deletePortfolio,
  updatePortfolio,
  addAbout,
  getAbout,
  editAbout,
  deleteAbout,
  addExperience,
  getExperience,
  editExperience,
  deleteExperience,
  addAvailability,
  getInquiries,
  addService,
  getServices,
  updateService,
  deleteService,
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import upload from "../middleware/multer.js";
import Portfolio from "../models/portfolioModel.js";

const router = express.Router();

//Portfolio Management
router.post(
  "/portfolio",
  verifyToken,
  requireAdmin,
  upload.array("images"),
  addPortfolio
);

router.get("/portfolio", verifyToken, requireAdmin, getPortfolios);

router.delete("/portfolio/:id", verifyToken, requireAdmin, deletePortfolio);

router.put(
  "/portfolio/:id",
  verifyToken,
  requireAdmin,
  upload.array("images"),
  updatePortfolio
);

// About management
router.post(
  "/about",
  verifyToken,
  requireAdmin,
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  addAbout
);
router.get("/about", getAbout);
router.put(
  "/about/:id",
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  editAbout
);
router.delete("/about/:id", verifyToken, requireAdmin, deleteAbout);

// Experience management
router.post(
  "/experience",
  verifyToken,
  requireAdmin,
  upload.single("mainImage"),
  addExperience
);
router.get("/experience", verifyToken, requireAdmin, getExperience);
router.put(
  "/experience/:id",
  verifyToken,
  requireAdmin,
  upload.single("mainImage"),
  editExperience
);
router.delete("/experience/:id", verifyToken, requireAdmin, deleteExperience);

//Service Management
router.post(
  "/services",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  addService
);
router.get("/services", verifyToken, requireAdmin, getServices);
router.put(
  "/services/:id",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  updateService
);
router.delete("/services/:id", verifyToken, requireAdmin, deleteService);

// Booking management
router.post("/booking", verifyToken, requireAdmin, addAvailability);

// Inquiry management
router.get("/inquiries", verifyToken, requireAdmin, getInquiries);

export default router;

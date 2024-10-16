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
  addService,
  getServices,
  updateService,
  deleteService,
  createOrUpdateHomepage, deleteHomepage, getHomepageContent
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import upload from "../middleware/multer.js";
import {
  getAllTestimonials,
  deleteTestimonial,
} from "../controllers/testimonialController.js";

const router = express.Router();

//Portfolio Management
router.post(
  "/manage-portfolio",
  verifyToken,
  requireAdmin,
  upload.array("images"),
  addPortfolio
);

router.get("/manage-portfolio", verifyToken, requireAdmin, getPortfolios);

router.delete(
  "/manage-portfolio/:id",
  verifyToken,
  requireAdmin,
  deletePortfolio
);

router.put(
  "/manage-portfolio/:id",
  verifyToken,
  requireAdmin,
  upload.array("images"),
  updatePortfolio
);

// About management
router.post(
  "/manage-about",
  verifyToken,
  requireAdmin,
  upload.fields([{ name: "image1" }, { name: "image2" }]),
  addAbout
);
router.get("/manage-about", getAbout);
router.put(
  "/manage-about/:id",
  verifyToken,
  requireAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  editAbout
);
router.delete("/manage-about/:id", verifyToken, requireAdmin, deleteAbout);

//Service Management
router.post(
  "/manage-services",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  addService
);
router.get("/manage-services", verifyToken, requireAdmin, getServices);
router.put(
  "/manage-services/:id",
  verifyToken,
  requireAdmin,
  upload.single("image"),
  updateService
);
router.delete("/manage-services/:id", verifyToken, requireAdmin, deleteService);

// Admin routes for testimonials
router.get("/testimonials", verifyToken, requireAdmin, getAllTestimonials); // Get all testimonials for admin
router.delete(
  "/testimonials/:id",
  verifyToken,
  requireAdmin,
  deleteTestimonial
); 

// Route to fetch the homepage data
router.get('/homepage', getHomepageContent);

// Route to create or update homepage
router.post('/homepage', upload.fields([
  { name: 'heroImage1', maxCount: 1 },
  { name: 'heroImage2', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 },
  { name: 'instagramBigImage', maxCount: 1 },
  { name: 'instagramSmallImages', maxCount: 4 }
]), createOrUpdateHomepage);

// **PUT route for updating homepage**
router.put('/homepage/:id', upload.fields([
  { name: 'heroImage1', maxCount: 1 },
  { name: 'heroImage2', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 },
  { name: 'instagramBigImage', maxCount: 1 },
  { name: 'instagramSmallImages', maxCount: 4 }
]), createOrUpdateHomepage);

// Route to delete homepage
router.delete('/homepage/:id', deleteHomepage);
export default router;

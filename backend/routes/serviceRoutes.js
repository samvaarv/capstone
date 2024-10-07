import express from 'express';
import { getAllServices, getServiceById } from '../controllers/serviceController.js';
const router = express.Router();

// Route to get all services
router.get('/services', getAllServices);

// Route to get a specific service by ID
router.get('/services/:id', getServiceById);

export default router;

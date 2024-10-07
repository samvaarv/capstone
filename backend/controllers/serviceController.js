import Service from '../models/serviceModel.js';

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: "Error fetching services" });
  }
};

// Get a specific service by ID
export const getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, service });
  } catch (error) {
    console.error("Error fetching service by ID:", error);
    res.status(500).json({ success: false, message: "Error fetching service" });
  }
};

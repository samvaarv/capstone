// controllers/testimonialController.js
import Testimonial from "../models/testimonialModel.js";

// Create user testimonial
export const createUserTestimonial = async (req, res) => {
  const { serviceId, rating, description } = req.body;
  const userId = req.user._id; // Assuming you have user ID from token

  try {
    const newTestimonial = new Testimonial({
      user: userId,
      service: serviceId,
      rating,
      description,
    });
    await newTestimonial.save();
    res.status(201).json({ message: "Testimonial submitted successfully!" });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    res.status(500).json({ message: "Failed to submit testimonial." });
  }
};

// Get testimonials for logged-in user
export const getUserTestimonials = async (req, res) => {
  const userId = req.user._id; // Get user ID from token
  try {
    const testimonials = await Testimonial.find({ user: userId })
      .populate("user")
      .populate("service"); // Populate service details
    res.status(200).json({ testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res.status(500).json({ message: "Failed to fetch testimonials." });
  }
};

export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .populate("user") // Populate user details if using references
      .populate("service"); // Populate service details if using references
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch testimonials." });
  }
};

export const deleteTestimonial = async (req, res) => {
  const { id } = req.params;

  try {
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    res.status(500).json({ message: "Failed to delete testimonial" });
  }
};

import Homepage from "../models/homePageModel.js";
import Portfolio from "../models/portfolioModel.js";
import Testimonial from "../models/testimonialModel.js";

export const getHomepageContent = async (req, res) => {
  try {
    const homepage = await Homepage.findOne();
    const portfolios = await Portfolio.find();
    const testimonials = await Testimonial.find().populate("user") .sort({ rating: -1 }).limit(5); // Top 5 testimonials

    if (!homepage) {
      return res.status(404).json({ success: false, message: "Homepage content not found" });
    }

    res.status(200).json({ 
      success: true, 
      homepage, 
      portfolios, 
      testimonials 
    });
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

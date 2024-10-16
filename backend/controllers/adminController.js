import fs from "fs";
import path from "path";
import Portfolio from "../models/portfolioModel.js";
import About from "../models/aboutModel.js";
import Service from "../models/serviceModel.js";
import Homepage from "../models/homePageModel.js";
import Inquiry from "../models/inquiryModel.js";
import Testimonial from "../models/testimonialModel.js";

// Get the directory name
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export const addPortfolio = async (req, res) => {
  const { title } = req.body;
  const images = req.files;

  try {
    const newPortfolio = new Portfolio({
      title,
      images: images.map((image) => image.filename),
    });

    await newPortfolio.save();
    res
      .status(201)
      .json({ success: true, message: "Portfolio added successfully" });
  } catch (error) {
    console.error("Error adding portfolio:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.status(200).json({ success: true, portfolios });
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    await Portfolio.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Portfolio deleted successfully" });
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  const { title } = req.body;
  const images = req.files;

  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio not found" });
    }

    // Update title
    portfolio.title = title;

    // Handle image replacement
    if (images.length > 0) {
      portfolio.images = images.map((image) => image.filename);
    }

    await portfolio.save();
    res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add About Content
export const addAbout = async (req, res) => {
  const { subHeading, heading, quote, title, description, pros, cons } =
    req.body;
  let image1, image2;

  if (req.files.image1) {
    image1 = req.files.image1[0].filename;
  }
  if (req.files.image2) {
    image2 = req.files.image2[0].filename;
  }
  try {
    const newAbout = new About({
      subHeading,
      heading,
      quote,
      title,
      description,
      image1,
      image2,
      pros: JSON.parse(pros), // Parse pros and cons from stringified arrays
      cons: JSON.parse(cons),
    });

    await newAbout.save();
    res.status(201).json({ success: true, about: newAbout });
  } catch (error) {
    console.error("Error adding about page:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get About Content
export const getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      return res
        .status(404)
        .json({ success: false, message: "No about page found" });
    }
    res.status(200).json({ success: true, about });
  } catch (error) {
    console.error("Error fetching about page:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit About Content
export const editAbout = async (req, res) => {
  const { subHeading, heading, quote, title, description, pros, cons } =
    req.body;
  try {
    const { id } = req.params;
    const about = await About.findById(id); // Find existing About content

    if (!about) {
      return res.status(404).json({ message: "About section not found" });
    }

    // Check if the user uploaded new images
    let newImage1 = about.image1;
    let newImage2 = about.image2;

    if (req.files) {
      if (req.files.image1) {
        // Delete old image1 if a new one is uploaded
        const oldImage1Path = path.join(
          __dirname,
          "backend",
          "public",
          "uploads",
          about.image1
        );
        if (fs.existsSync(oldImage1Path)) {
          fs.unlinkSync(oldImage1Path);
        }
        newImage1 = req.files.image1[0].filename; // Assign new image1 filename
      }

      if (req.files.image2) {
        // Delete old image2 if a new one is uploaded
        const oldImage2Path = path.join(
          __dirname,
          "backend",
          "public",
          "uploads",
          about.image2
        );
        if (fs.existsSync(oldImage2Path)) {
          fs.unlinkSync(oldImage2Path);
        }
        newImage2 = req.files.image2[0].filename; // Assign new image2 filename
      }
    }

    // Update the about section with new information
    about.title = title;
    about.description = description;
    about.image1 = newImage1;
    about.image2 = newImage2;
    about.subHeading = subHeading;
    about.heading = heading;
    about.quote = quote;
    about.pros = JSON.parse(pros);
    about.cons = JSON.parse(cons);

    await about.save(); // Save the updated about section

    res
      .status(200)
      .json({ message: "About section updated successfully", about });
  } catch (error) {
    console.error("Error updating about section: ", error);
    res.status(500).json({ message: "Error updating about section", error });
  }
};

// Delete About Content
export const deleteAbout = async (req, res) => {
  try {
    const about = await About.findById(req.params.id); // Find the about section
    if (!about) {
      return res.status(404).json({ message: "About section not found" });
    }

    // Delete the associated images
    const image1Path = path.join(
      __dirname,
      "backend",
      "public",
      "uploads",
      about.image1
    );
    const image2Path = path.join(
      __dirname,
      "backend",
      "public",
      "uploads",
      about.image2
    );

    if (fs.existsSync(image1Path)) {
      fs.unlinkSync(image1Path); // Delete image1
    }
    if (fs.existsSync(image2Path)) {
      fs.unlinkSync(image2Path); // Delete image2
    }

    // Instead of about.remove(), use findByIdAndDelete
    await About.findByIdAndDelete(req.params.id); // Delete the about entry from the database
    res.status(200).json({ message: "About section deleted successfully" });
  } catch (error) {
    console.error("Error deleting about section: ", error);
    res.status(500).json({ message: "Error deleting about section", error });
  }
};

// Add Service
export const addService = async (req, res) => {
  const { name, description, price, bookingLink } = req.body;
  const image = req.file;

  try {
    const newService = new Service({
      name,
      description,
      price,
      bookingLink,
      image: image.filename, // Store only the filename
    });

    await newService.save();
    res
      .status(201)
      .json({ success: true, message: "Service added successfully" });
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all services
export const getServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({ success: true, services });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Service
export const updateService = async (req, res) => {
  const { name, description, price, bookingLink } = req.body;
  const image = req.file;

  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        bookingLink,
        ...(image && { image: image.filename }),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      updatedService,
    });
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Service
export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addAvailability = async (req, res) => {
  const { date, timeSlots } = req.body;

  try {
    const newAvailability = new Availability({ date, timeSlots });
    await newAvailability.save();
    res
      .status(201)
      .json({ success: true, message: "Availability added successfully" });
  } catch (error) {
    console.error("Error adding availability:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create or update homepage
export const createOrUpdateHomepage = async (req, res) => {
  try {
    const homepageData = {
      heroTitle: req.body.heroTitle,
      heroDescription: req.body.heroDescription,
      aboutTitle: req.body.aboutTitle,
      aboutDescription: req.body.aboutDescription,
    };

    // Check Instagram Small Images limit
    if (
      req.files.instagramSmallImages &&
      req.files.instagramSmallImages.length > 4
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You can upload a maximum of 4 images for Instagram small images.",
      });
    }

    if (req.files.heroImage1)
      homepageData.heroImage1 = req.files.heroImage1[0].filename;
    if (req.files.heroImage2)
      homepageData.heroImage2 = req.files.heroImage2[0].filename;
    if (req.files.aboutImage)
      homepageData.aboutImage = req.files.aboutImage[0].filename;
    if (req.files.instagramBigImage)
      homepageData.instagramBigImage = req.files.instagramBigImage[0].filename;
    if (req.files.instagramSmallImages) {
      homepageData.instagramSmallImages = req.files.instagramSmallImages.map(
        (file) => file.filename
      );
    }

    let homepage;
    if (req.params.id) {
      homepage = await Homepage.findByIdAndUpdate(req.params.id, homepageData, {
        new: true,
      });
      if (!homepage)
        return res
          .status(404)
          .json({ success: false, message: "Homepage not found" });
    } else {
      homepage = new Homepage(homepageData);
      await homepage.save();
    }

    res.status(200).json({ success: true, homepage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get homepage content
export const getHomepageContent = async (req, res) => {
  try {
    const homepage = await Homepage.findOne();
    if (!homepage)
      return res
        .status(404)
        .json({ success: false, message: "Homepage not found" });
    res.status(200).json({ success: true, homepage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete homepage content
export const deleteHomepage = async (req, res) => {
  try {
    await Homepage.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Homepage deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

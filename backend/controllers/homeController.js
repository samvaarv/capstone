import HomePage from "../models/homePageModel.js";

// Get home page data
export const getHomePage = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();
    if (!homePage) {
      return res.status(404).json({ message: "Home page data not found" });
    }
    res.status(200).json(homePage);
  } catch (error) {
    res.status(500).json({ message: "Error fetching home page data" });
  }
};

// Update home page data (for admin)
export const updateHomePage = async (req, res) => {
  const {
    title,
    description,
    aboutSection,
    gallery,
    portfolio,
    testimonials,
    instagram,
  } = req.body;

  try {
    let homePage = await HomePage.findOne();
    if (!homePage) {
      homePage = new HomePage();
    }

    // Update fields
    homePage.title = title;
    homePage.description = description;

    // Handling hero images separately
    homePage.heroImages = {
      image1: req.files?.image1
        ? req.files.image1[0].filename
        : homePage.heroImages.image1,
      image2: req.files?.image2
        ? req.files.image2[0].filename
        : homePage.heroImages.image2,
    };

    homePage.aboutSection = aboutSection;
    homePage.gallery = gallery;
    homePage.portfolio = portfolio;
    homePage.testimonials = testimonials;
    homePage.instagram = instagram;

    await homePage.save();
    res.status(200).json({ message: "Home page updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating home page content" });
  }
};

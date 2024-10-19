import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PortfolioList = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [hoverImage, setHoverImage] = useState(""); // Image URL on hover
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 }); // Image position state

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get("/api/portfolio"); // Adjust endpoint if necessary
        if (response.data.success) {
          setPortfolios(response.data.portfolios);
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
    };

    fetchPortfolios();
  }, []);

  const handleMouseOver = (images, e) => {
    if (images && images.length > 0) {
      const imageUrl = `${import.meta.env.VITE_BACKEND_URL}/uploads/${
        images[0]
      }`; // Set the first image URL
      setHoverImage(imageUrl); // Set the hover image

      // Calculate image position centered over the text
      const { clientX, clientY } = e;
      setImagePosition({ x: clientX, y: clientY });
    }
  };

  const handleMouseLeave = () => {
    setHoverImage(""); // Clear hover image on mouse leave
  };

  const handleMouseMove = (e) => {
    setImagePosition({ x: e.clientX, y: e.clientY }); // Update image position based on mouse coordinates
  };

  return (
    <section
      className="relative flex flex-col item-center mx-auto max-w-7xl min-h-svh px-4 sm:px-6 lg:px-8 py-16"
      onMouseMove={handleMouseMove}
    >
      {hoverImage && ( // Show the image only if hoverImage is not empty
        <div
          className="background-image absolute w-4/12"
          style={{
            left: `${imagePosition.x}px`,
            top: `${imagePosition.y}px`,
            transform: "translate(-50%, -50%)",
            display: hoverImage ? "block" : "none", // Control visibility
          }}
        >
          <img src={hoverImage} alt="Portfolio Background" />
        </div>
      )}

      <h1 className="text-lg font-bold text-center uppercase mb-4">
        Portfolios
      </h1>
      <ul className="portfolio-list">
        {portfolios.map((portfolio) => (
          <li
            key={portfolio._id}
            className="item relative text-center py-2 md:py-5"
            onMouseOver={(e) => handleMouseOver(portfolio.images, e)} // Pass images and event to hover function
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={`/portfolio/${portfolio._id}`}
              className="font-main uppercase"
            >
              {portfolio.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PortfolioList;

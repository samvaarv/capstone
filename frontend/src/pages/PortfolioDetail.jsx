// PortfolioDetail.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const PortfolioDetail = () => {
  const { id } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(`/api/portfolio/${id}`);
        if (response.data.success) {
          setPortfolio(response.data.portfolio);
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      }
    };

    fetchPortfolio();
  }, [id]);

  if (!portfolio) return <p>Loading...</p>;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-light text-3xl md:text-5xl text-center font-bold tracking-widest uppercase mb-20">
        {portfolio.title}
      </h1>
      <div className="columns-2 md:columns-3 gap-4">
        {portfolio.images.map((image, index) => (
          <img
            key={index}
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${image}`}
            alt={`Portfolio image ${index + 1}`}
            className="w-full h-auto mb-4 cursor-pointer"
            onClick={() => {
              setCurrentIndex(index); // Set the clicked image index
              setOpen(true); // Open the lightbox
            }}
          />
        ))}
      </div>

      {portfolio && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={portfolio.images.map((image) => ({
            src: `${import.meta.env.VITE_BACKEND_URL}/uploads/${image}`,
          }))}
          index={currentIndex}
          onIndexChange={setCurrentIndex} // Track current image index
        />
      )}
    </section>
  );
};

export default PortfolioDetail;

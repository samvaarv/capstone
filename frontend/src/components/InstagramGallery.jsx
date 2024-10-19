import React from "react";

const InstagramGallery = ({ bigImage, smallImages }) => {
  return (
    <section className="instagram-section relative px-4 sm:px-6 lg:px-8 py-16">
      <div className="instagram-images grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-4">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${bigImage}`}
          alt="Instagram Big"
          className="hidden sm:block col-start-1 col-span-2 row-start-1 row-span-2"
        />
        {smallImages.map((image, index) => (
          <img
            key={index}
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${image}`}
            alt={`Instagram Small ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ))}
      </div>
      <a
        href=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <button className="btn-circle w-40 h-40">@VEARSHOT</button>
      </a>
    </section>
  );
};

export default InstagramGallery;

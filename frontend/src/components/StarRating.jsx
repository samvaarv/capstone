import React, { useState } from "react";

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleMouseEnter = (index) => {
    if (!readOnly) setHoveredRating(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoveredRating(0);
  };

  const handleClick = (index) => {
    if (!readOnly) onRatingChange(index);
  };

  return (
    <div className="inline-flex justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-4 w-4 cursor-pointer ${star <= (hoveredRating || rating) ? "text-yellow-500" : "text-gray-400"}`}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
          stroke="currentColor"
          style={{ strokeWidth: '1.5px' }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;

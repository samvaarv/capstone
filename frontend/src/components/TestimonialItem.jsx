import React from "react";
import StarRating from "./StarRating"; // Import the StarRating component

const TestimonialItem = ({ testimonial }) => {
  return (
    <div className="border p-4 mb-4 bg-gray-100">
      <h6 className="font-bold uppercase mb-3">{testimonial.service.name}</h6>
      <div className="flex items-end justify-between mb-3">
        <StarRating rating={testimonial.rating} readOnly={true} />
        <span className="text-xs text-slate-500">
          {new Date(testimonial.createdAt).toLocaleDateString()}
          {new Date(testimonial.createdAt).toLocaleTimeString()}
        </span>
      </div>
      <p className="uppercase font-extralight">{testimonial.description}</p>
    </div>
  );
};

export default TestimonialItem;

import React from "react";
import StarRating from "./StarRating"; // Import the StarRating component

const TestimonialItem = ({ testimonial }) => {
  return (
    <div className="border p-4 mb-4 bg-gray-100">
      <div className="flex">
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
            testimonial.user.profileImage
          }`}
          alt={testimonial.user.name} className="w-12 h-12 object-cover rounded-full"
        />
        <div className="mb-4 pl-3"  style={{width: 'calc(100% - 48px )'}}>
          <h6 className="font-bold uppercase mb-2">
            {testimonial.service.name}
          </h6>
          <div className="flex justify-between">
            <StarRating rating={testimonial.rating} readOnly={true} />
            <span className="text-xs text-slate-500 inline-block">
              {new Date(testimonial.createdAt).toLocaleDateString()}
              {new Date(testimonial.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
      <p className="uppercase font-extralight">{testimonial.description}</p>
    </div>
  );
};

export default TestimonialItem;

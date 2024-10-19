import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import StarRating from "../../components/StarRating";
import TestimonialItem from "../../components/TestimonialItem";
import Input from "../../components/Input";
import { toast } from "react-toastify";

const ClientTestimonial = () => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [userTestimonials, setUserTestimonials] = useState([]);

  useEffect(() => {
    // Fetch available services for the dropdown
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/services");
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
    fetchUserTestimonials(); // Fetch user testimonials on component mount
  }, []);

  // Fetch user testimonials for the current user
  const fetchUserTestimonials = async () => {
    try {
      const response = await axios.get("/api/client/testimonials");
      setUserTestimonials(response.data.testimonials);
    } catch (error) {
      console.error("Error fetching user testimonials:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedService || !rating || !description) {
      toast.error("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post("/api/testimonials", {
        serviceId: selectedService,
        rating,
        description,
      });
      toast.success(response.data.message);
      fetchUserTestimonials(); // Refresh testimonials
      // Reset fields after submission
      setSelectedService("");
      setRating(0);
      setDescription("");
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast.error("Failed to submit testimonial.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        Reviews
      </h3>
      <div className="lg:w-1/2 mr-auto p-4 shadow-md mb-10">
        <h4 className="uppercase text-md font-semibold mb-3">Write a review</h4>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-6">
            <label className="block text-dark tracking-2 text-xs mb-2">
              SELECT A SERVICE
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required
              className="w-full pl-3 pr-3 py-2 bg-white bg-opacity-50 border border-dark focus:border-primary text-dark transition duration-200"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>

          <Input
            type="textarea"
            placeholder="Write your testimonial..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            className="btn-primary uppercase text-xs tracking-widest text-white hover:text-dark px-8 py-4 mb-5 md:mb-0"
            type="submit"
          >
            Submit Review
          </button>
        </form>
      </div>

      <div className="user-testimonials mt-8">
        <h4 className="uppercase text-md font-semibold mb-3">
          All your reviews
        </h4>
        {userTestimonials.length > 0 ? (
          <ul className="flex flex-col md:flex-row gap-4">
            {userTestimonials.map((testimonial) => (
              <li key={testimonial._id} className="mt-2 w-full md:w-1/2">
                <TestimonialItem testimonial={testimonial} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs">No testimonials available.</p>
        )}
      </div>
    </motion.section>
  );
};

export default ClientTestimonial;

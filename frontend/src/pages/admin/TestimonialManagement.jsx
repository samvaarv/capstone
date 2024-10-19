import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import TestimonialItemAdmin from "../../components/TestimonialItemAdmin";
import { toast } from "react-toastify";

const TestimonialManagement = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get("/api/admin/testimonials", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setTestimonials(response.data.testimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        toast.error("Failed to fetch testimonials.");
      }
    };

    fetchTestimonials();
  }, []);

  const handleDelete = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      await axios.delete(`/api/admin/testimonials/${testimonialToDelete._id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTestimonials(
        testimonials.filter((t) => t._id !== testimonialToDelete._id)
      );
      toast.success("Testimonial deleted successfully!");
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete testimonial.");
    } finally {
      setIsModalOpen(false); // Close the modal
      setTestimonialToDelete(null); // Clear the testimonial to delete
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        Manage Testimonials
      </h3>
      {testimonials.length > 0 ? (
        <ul className="grid md:grid-cols-2 gap-4">
          {testimonials.map((testimonial) => (
            <li key={testimonial._id} className="border border-dark p-4 mb-4">
              <TestimonialItemAdmin testimonial={testimonial} />
              <button
                onClick={() => handleDelete(testimonial)}
                className="bg-red-500 text-white text-xs uppercase py-2 px-5 mt-4 hover:bg-red-700 transition"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No testimonials available.</p>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && testimonialToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 shadow-lg w-1/3">
            <h4 className="text-xl font-semibold mb-4">Confirm Deletion</h4>
            <p>Are you sure you want to delete this testimonial?</p>
            <div className="text-sm mt-4">
              <p>
                <strong>User:</strong> {testimonialToDelete.user.name}
              </p>
              <p>
                <strong>Service:</strong> {testimonialToDelete.service.name}
              </p>
              <p>
                <strong>Rating:</strong> {testimonialToDelete.rating} ★
              </p>
              <p>{testimonialToDelete.description}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(testimonialToDelete.createdAt).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(testimonialToDelete.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)} // Close confirmation modal
                className="text-dark text-xs uppercase py-2 px-5 border border-dark hover:text-white hover:bg-dark transition mt-3 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete} // Confirm delete action
                className="bg-red-500 text-white text-xs uppercase py-2 px-5 hover:bg-red-700 transition mt-3"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.section>
  );
};

export default TestimonialManagement;

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore"; // Assuming you have the auth store
import { ToastContainer, toast } from "react-toastify"; // Import toast components
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const ContactForm = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setEmail(user.email); // Auto-fill email if the user is logged in
    }
  }, [user, isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const inquiryData = {
      firstName,
      lastName,
      email,
      subject,
      message,
    };

    try {
      await axios.post("/api/contact", inquiryData);
      toast.success("Message sent successfully."); // Display success toast
      // Reset form after submission
      setFirstName("");
      setLastName("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message", error);
      toast.error("Error sending message."); // Display error toast
    }
  };

  return (
    <div>
      <ToastContainer /> {/* Add ToastContainer to your JSX */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
        <div>
          <label className="block mb-2">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isAuthenticated} // Disable if logged in
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;

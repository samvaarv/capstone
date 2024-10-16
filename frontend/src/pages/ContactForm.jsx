import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { ToastContainer, toast } from "react-toastify";
import Input from "../components/Input";
import "react-toastify/dist/ReactToastify.css";

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
    <section className="border-b border-dark">
      <div className="md:grid grid-cols-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="col-start-1 col-span-2 md:border-r md:border-dark relative h-full pt-16">
          <h1 className="text-5xl md:text-8xl font-bold mb-8 md:mb-0 font-light tracking-widest text-nowrap md:rotate-90 md:absolute md:left-1/2 md:transform md:origin-left">
            CONTACT ME
          </h1>
        </div>

        <div className="col-start-4 col-span-8 px-0 pb-16 md:p-20">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-md md:text-xl mb-8 uppercase tracking-widest">
              If you have any qurries or want to know more my work and services,
              don't hesitate to drop in the message. I'll be happy to get back
              to your message as soon as possible.
            </h2>
            <ToastContainer />
            <form onSubmit={handleSubmit}>
              <Input
                label="FIRST NAME"
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <Input
                label="LAST NAME"
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              <Input
                label="EMAIL"
                type="email"
                placeholder="Email Address"
                value={email}
                required
                disabled={isAuthenticated}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="SUBJECT"
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Input
                label="Message"
                type="textarea"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
                type="submit"
              >
                SEND MESSAGE
              </button>
            </form>
          </motion.section>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;

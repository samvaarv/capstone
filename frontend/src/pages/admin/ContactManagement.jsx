import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "../../components/Input";

const ContactManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get("/api/inquiries");
        setInquiries(response.data.inquiries);
      } catch (error) {
        console.error("Error fetching inquiries", error);
      }
    };

    fetchInquiries();
  }, []);

  const handleReply = async (inquiryId) => {
    try {
      await axios.post(`/api/contact/reply/${inquiryId}`, { replyMessage });
      toast.success("Reply sent successfully! The client has been notified.");
      setReplyMessage(""); // Clear the reply input after sending
    } catch (error) {
      console.error("Error sending reply", error);
      toast.error("Failed to send reply.");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        Inquiries
      </h3>
      {inquiries.length === 0 ? (
        <p className="text-xs mb-4">No inquiries found.</p>
      ) : (
        inquiries.map((inquiry) => (
          <div key={inquiry._id} className="p-4 border border-dark mb-4">
            <h4 className="mb-2">
              <strong className="uppercase text-xs">From:</strong>{" "}
              {inquiry.firstName} {inquiry.lastName} - {inquiry.email}
            </h4>
            <p className="mb-2">
              <strong className="uppercase text-xs">Subject: </strong>
              {inquiry.subject}
            </p>
            <p className="mb-2">
              <strong className="uppercase text-xs">Message:</strong>
            </p>
            <p className="mb-2">{inquiry.message}</p>
            <p className="text-xs text-gray-500">
              Received on: {new Date(inquiry.createdAt).toLocaleString()}
            </p>{" "}
            {/* Display date and time */}
            {/* If the inquiry hasn't been replied to, show the reply form */}
            {!inquiry.replied && (
              <div className="mt-4">
                <Input
                  label="REPLY"
                  type="textarea"
                  placeholder="Reply to this message"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="bg-white"
                />
                <button
                  onClick={() => handleReply(inquiry._id)}
                  className="py-3 px-10 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"

                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </motion.section>
  );
};

export default ContactManagement;

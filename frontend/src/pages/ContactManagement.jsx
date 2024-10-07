import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

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
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Inquiries</h2>
      {inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        inquiries.map((inquiry) => (
          <div key={inquiry._id} className="p-4 border mb-4">
            <h3 className="font-bold">{inquiry.subject}</h3>
            <p>
              From: {inquiry.firstName} {inquiry.lastName} - {inquiry.email}
            </p>
            <p>{inquiry.message}</p>
            <p className="text-gray-500">Received on: {new Date(inquiry.createdAt).toLocaleString()}</p> {/* Display date and time */}

            {/* If the inquiry hasn't been replied to, show the reply form */}
            {!inquiry.replied && (
              <div className="mt-4">
                <textarea
                  placeholder="Reply to this message"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-2"
                ></textarea>
                <button
                  onClick={() => handleReply(inquiry._id)}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Send Reply
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ContactManagement;

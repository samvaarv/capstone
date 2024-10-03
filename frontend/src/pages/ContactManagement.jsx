import { useState, useEffect } from "react";
import axios from "axios";

const ContactManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get("/api/admin/inquiries");
        console.log("API Response:", response.data); // Log to see the response
        if (response.data.success) {
          setInquiries(response.data.inquiries);
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  if (loading) {
    return <p>Loading inquiries...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customer Inquiries</h2>
      {inquiries.length > 0 ? (
        <ul className="space-y-4">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry._id}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              <h3 className="font-bold">{inquiry.title || "No Title"}</h3>
              <p>
                <strong>Name:</strong> {inquiry.name}
              </p>
              <p>
                <strong>Email:</strong> {inquiry.email}
              </p>
              <p>
                <strong>Message:</strong> {inquiry.message}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No inquiries found.</p>
      )}
    </div>
  );
};

export default ContactManagement;

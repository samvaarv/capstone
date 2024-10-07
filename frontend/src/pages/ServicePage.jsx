import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ServicePage = () => {
  const [services, setServices] = useState([]);
  const BACKEND_URL = "http://localhost:8888";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/services");
        setServices(response.data.services);
      } catch (error) {
        console.error("Error fetching services", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="service-page max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Available Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{service.name}</h3>
            {service.image && <img src={`${BACKEND_URL}/uploads/${service.image}`} alt={service.name} className="my-2" />}
            <p>{service.description}</p>
            <p>Price: ${service.price}</p>
            <Link to={`/book-service/${service._id}`} className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded">
              Book Now
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePage;

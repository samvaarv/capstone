import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ServicePage = () => {
  const [services, setServices] = useState([]);

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
    <>
      <section className="service-banner md:grid md:grid-cols-12 items-center gap-4 px-4 sm:px-6 lg:px-8 py-16 border-b border-dark">
        <div className="col-span-6 grid grid-cols-6 ">
          <img
            src="../service1.png"
            alt="Service main image"
            className="col-start-1 col-span-4 row-start-1 row-span-6"
          />
          <img
            src="../service2.png"
            alt="Service secondary image"
            className="col-start-4 col-span-3 row-start-3 row-span-3"
          />
        </div>
        <div className="col-start-8 col-span-4 pt-8">
          <h2 className="text-xl uppercase font-semibold mb-7">Services</h2>
          <p className="font-main text-5xl md:text-7xl uppercase">
            I tell stories with photos
          </p>
        </div>
      </section>
      <section className="services">
        {services.map((service) => (
          <div
            key={service._id}
            className="md:grid grid-cols-12 items-center gap-4 px-4 sm:px-6 lg:px-8 py-16 border-b border-dark"
          >
            {service.image && (
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                  service.image
                }`}
                alt={service.name}
                className="md:col-span-4 lg:col-span-3 object-cover w-1/3 md:h-full md:w-full"
              />
            )}
            <div className="col-start-5 col-span-6 py-8">
              <h3 className="font-main font-bold text-3xl uppercase mb-6">
                {service.name}
              </h3>
              <p className="text-sm">{service.description}</p>
            </div>
            <div className="col-start-11 col-span-2 md:text-right">
              <p className="font-medium text-lg">
                ${service.price} <small>+ HST</small>
              </p>
              <span className="font-medium uppercase text-sm">
                starting price
              </span>
              <Link
                to={`/book-service/${service._id}`}
                className="mt-4 block text-primary text-primary uppercase underline  underline-offset-2 hover:text-dark transition"
              >
                Book Now
              </Link>
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ServicePage;

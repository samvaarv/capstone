import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AboutPage = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get("/api/about"); // Adjust the URL based on your route
        if (response.data.success) {
          setAboutData(response.data.about[0]); // Assuming there's one entry
        } else {
          toast.error("Failed to fetch about data.");
        }
      } catch (error) {
        console.error("Error fetching about data:", error);
        toast.error("Failed to fetch about data.");
      }
    };

    fetchAboutData();
  }, []);

  if (!aboutData) return <div>Loading...</div>;

  return (
    <>
      <section className="md:grid md:grid-cols-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 gap-4">
        <ToastContainer />
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
            aboutData.image1
          }`}
          alt="About Image 1"
          className="w-full h-auto col-start-1 col-span-5"
        />
        <div className="col-start-7 col-span-6 flex flex-col justify-end pt-9">
          <h2 className="uppercase tracking-2 text-sm mb-5">
            {aboutData.subHeading}
          </h2>
          <h1 className="font-light text-8xl lg:text-9xl tracking-2 font-bold">
            {aboutData.heading}
          </h1>
        </div>
        <div className="flex items-start col-start-1 col-span-4 mt-10 md:mt-16 pt-5">
          <span className="inline-block w-2/3 h-px bg-dark me-9"></span>
          <span className="inline-block w-2 h-2 bg-dark transform rotate-45 flex justify-center items-center"></span>
        </div>
        <div className="col-start-5 col-span-8 mt-10 md:mt-16">
          <blockquote>
            <p className="quote text-4xl">{aboutData.quote}</p>
          </blockquote>
        </div>
      </section>
      <section className="md:grid md:grid-cols-12 gap-4 bg-secondary px-6 md:px-0 pb-16 md:pb-0">
        <div className="flex flex-col justify-center col-start-2 col-span-4 text-white py-12">
          <h2 className="font-light tracking-2 section-title mb-9">
            {aboutData.title}
          </h2>
          <p className="font-extralight leading-relaxed">
            {aboutData.description}
          </p>
        </div>
        <div className="col-start-7 col-span-6">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
              aboutData.image2
            }`}
            alt="About Image 2"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
      <section className="md:grid md:grid-cols-12 gap-4">
        <div className="col-span-6 md:grid md:grid-cols-6 py-16 border-b">
          <div className="col-start-2 col-span-5 text-center px-6 md:px-4">
            <h3 className="text-sm uppercase font-semibold pb-8">
              A LOT OF THIS
            </h3>
            <span className="block w-full h-px bg-dark mb-8"></span>
            <ul className="compare-list">
              {aboutData.pros.map((pro, index) => (
                <li key={index} className="flex justify-center text-2xl my-4">
                  {pro}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-span-6 bg-secondary md:grid md:grid-cols-6">
          <div className="col-span-5 px-6 md:pl-8 md:pr-4 text-center text-white py-16">
            <h3 className="text-sm uppercase font-semibold pb-8">
              NONE OF THAT
            </h3>
            <span className="block w-full h-px bg-white mb-8"></span>
            <ul className="compare-list">
              {aboutData.cons.map((con, index) => (
                <li key={index} className="flex justify-center text-2xl my-4">
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;

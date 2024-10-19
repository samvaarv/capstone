import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import InstagramGallery from "../components/InstagramGallery";
import StarRating from "../components/StarRating";

const Homepage = () => {
  const [homepageData, setHomepageData] = useState({
    testimonials: [],
    portfolios: [],
  });
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const length = homepageData.testimonials.length;

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await axios.get("/api/homepage");
        if (response.data.success) {
          setHomepageData({
            ...response.data.homepage,
            portfolios: response.data.portfolios,
            testimonials: response.data.testimonials,
          });
        } else {
          console.error(
            "Failed to fetch homepage data:",
            response.data.message
          );
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchHomepageData();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading state until data is fetched

  if (!homepageData) return <div>Error: Homepage data not found.</div>;

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  // Previous testimonial
  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (loading) {
    return <div>Loading testimonials...</div>;
  }

  if (!Array.isArray(homepageData.testimonials) || length === 0) {
    return <div>No testimonials available.</div>;
  }

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section px-4 sm:px-6 lg:px-8 py-16">
        <div className="md:grid md:grid-rows-5 md:grid-cols-12 gap-4">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
              homepageData.heroImage2
            }`}
            alt="Hero 2"
            className="col-start-11 col-span-2 row-span-2 mx-auto w-1/3 md:w-full"
          />
          <div className="hero-title-block row-start-2 row-span-4 col-start-4 col-span-6 relative text-center md:text-left mt-5 md:mt-0">
            <h2 className="hero-title font-main uppercase tracking-wide text-outline">
              {homepageData.heroTitle}
            </h2>
            <h2 className="hero-title hero-title-back font-main uppercase tracking-wide absolute inset-0">
              {homepageData.heroTitle}
            </h2>
          </div>
          <div className="row-start-4 row-span-2 col-start-8 col-span-4 z-20 text-center md:text-left mt-5 md:mt-0">
            <p className="text-sm md:text-md tracking-2 mb-6">
              {homepageData.heroDescription}
            </p>
            <Link to="/contact">
              <button className="btn-primary uppercase text-xs tracking-widest text-white hover:text-dark px-8 py-4 mb-5 md:mb-0">
                HIRE ME
              </button>
            </Link>
          </div>
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
              homepageData.heroImage1
            }`}
            alt="Hero 1"
            className="w-1/2 md:w-full h-full object-cover row-start-3 row-span-5 col-start-1 col-span-6 mx-auto"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section bg-primary">
        <div className="md:grid md:grid-cols-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="relative col-start-2 col-span-4 text-center md:text-left mb-6 md:mb-0">
            <h2 className="tracking-2 mb-5 text-white font-semibold">ABOUT</h2>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                homepageData.aboutImage
              }`}
              alt="About"
              className="w-1/2 md:w-full mx-auto"
            />
            <Link
              to="/about"
              className="absolute hidden md:block bottom-0 -right-1/4"
            >
              <button className="btn-circle w-48 h-48">Tell Us More</button>
            </Link>
          </div>
          <div className="col-start-7 col-span-5 text-white text-center md:text-left">
            <h3 className="section-title uppercase font-main mb-6">
              {homepageData.aboutTitle}
            </h3>
            <p className="mb-6">{homepageData.aboutDescription}</p>
            <Link to="/about" className="md:hidden">
              <button className="text-white text-sm uppercase border border-white hover:text-white hover:bg-dark transition py-4 px-8 mt-6">
                Tell Us More
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="portfolio-section mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center font-semibold">
        <h2 className="tracking-2 mb-12 text-dark uppercase">Portfolio</h2>
        <ul className="portfolio-list">
          {homepageData.portfolios &&
            homepageData.portfolios.map((portfolio) => (
              <li key={portfolio._id} className="mb-6 md:mb-9">
                <h3>
                  <span className="block text-xs"></span>
                  <Link
                    to={`/portfolio/${portfolio._id}`}
                    className="font-main uppercase hover:italic"
                  >
                    {portfolio.title}
                  </Link>
                </h3>
              </li>
            ))}
        </ul>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:grid md:grid-cols-12 md:grid-rows-auto">
          <h2 className="section-title col-start-2 col-span-10 font-main uppercase text-white text-center md:text-left mb-8">
            Kind words from clients
          </h2>
          <div className="slider relative col-start-2 col-span-10 row-start-2">
            {homepageData.testimonials &&
              homepageData.testimonials.map((testimonial, index) => (
                <div
                  className={`slide ${index === current ? "active" : ""}`}
                  key={index}
                >
                  {index === current && (
                    <div className="testimonial-content md:grid md:grid-cols-10 md:grid-rows-4">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                          testimonial.user.profileImage
                        }`}
                        alt={testimonial.user.name}
                        className="col-start-1 col-span-5 row-start-1 row-span-4 w-14 h-14 md:h-full md:w-full -mb-5 mx-auto md:mb-0 object-cover"
                      />
                      <div className="col-start-5 col-span-6 row-start-2 row-span-2 bg-white text-center md:text-left px-5 pt-8 pb-5 md:p-8">
                        <h3 className="font-main text-xl font-semibold tracking-widest mb-2">
                          {testimonial.user.name}
                        </h3>
                        <StarRating
                          rating={testimonial.rating}
                          readOnly={true}
                        />
                        <p className="mt-4 md:mt-5 text-sm">
                          {testimonial.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            <div className="md:absolute md:right-0 md:top-0 mt-8 md:mt-0 text-center">
              <button onClick={prevSlide} className="btn-arrow left-arrow me-2">
                ❮
              </button>
              <button onClick={nextSlide} className="btn-arrow right-arrow">
                ❯
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Section */}
      <InstagramGallery
        bigImage={homepageData.instagramBigImage}
        smallImages={homepageData.instagramSmallImages}
      />
    </div>
  );
};

export default Homepage;

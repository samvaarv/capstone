import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="pt-10 md:pt-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-7xl lg:text-9xl text-center">
          <Link
            to="/contact"
            className="font-main text-dark hover:text-secondary uppercase tracking-1 leading-3 transition"
          >
            Let's Fall In Love
          </Link>
        </h2>
        <div className="flex flex-wrap py-12">
          <div className="w-full lg:w-1/4 px-2 mt-2 text-center">
            <Link to="/">
              <img
                className="logo h-11 lg:h-16 mx-auto lg:mx-0"
                src="../logo.png"
                alt="VearShot Logo"
              />
            </Link>
          </div>
          <div className="w-full lg:w-7/12 px-2 pt-10 lg:pt-0">
            <nav className="flex flex-wrap justify-center space-x-5">
              <Link
                to="/"
                className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold mt-5"
              >
                Home
              </Link>
              <Link
                to="/portfolio"
                className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold mt-5"
              >
                Portfolio
              </Link>
              <Link
                to="/about"
                className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold mt-5"
              >
                About
              </Link>
              <Link
                to="/services"
                className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold mt-5"
              >
                Services
              </Link>
              <Link
                to="/contact"
                className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold mt-5"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="w-full lg:w-1/6 px-2 mt-6 pt-9 lg:pt-0 flex justify-center lg:justify-end">
            <a
              href="mailto:vearshotphoto@gmail.com"
              className="uppercase text-xs font-semibold hover:text-secondary"
            >
              vearshotphoto@gmail.com
            </a>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 border-dark border-t pt-6 pb-9">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row justify-between item-center">
          <p className="text-xs text-center sm:text-left leading-6">
            &copy; 2024 VEARSHOT. All Rights Reserved
          </p>
          <ul className="flex flex-wrap justify-center space-x-5">
            <li>
              <a
                href="https://www.instagram.com/vear.bear/"
                className="text-xs hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://www.facebook.com/samvaarv"
                className="text-xs hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://ca.pinterest.com/samvaarv/"
                className="text-xs hover:text-primary transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pinterest
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

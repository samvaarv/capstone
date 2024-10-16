import React, { useEffect, useState } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Fragment } from "react";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect to disable body scroll when mobile menu is open
  useEffect(() => {
    const body = document.body;

    if (isMobileMenuOpen) {
      body.style.overflow = "hidden"; // Disable scroll
    } else {
      body.style.overflow = "auto"; // Enable scroll
    }

    // Clean up the effect on unmount
    return () => {
      body.style.overflow = "auto";
    };
  }, [isMobileMenuOpen]); // Dependency array to trigger when isMobileMenuOpen changes

  return (
    <Disclosure as="nav" className="bg-transparent border-b border-dark">
      {({ open }) => {
        // Update state when the mobile menu opens or closes
        useEffect(() => {
          setIsMobileMenuOpen(open);
        }, [open]);

        return (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-7">
              <div className="flex h-16 justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                  <Link to="/">
                    <img
                      className="logo h-11 lg:h-16"
                      src="../logo.png"
                      alt="VearShot Logo"
                    />
                  </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="flex items-center">
                  <div className="hidden lg:flex space-x-5 me-5">
                    <Link
                      to="/"
                      className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold"
                    >
                      Home
                    </Link>
                    <Link
                      to="/portfolio"
                      className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold"
                    >
                      Portfolio
                    </Link>
                    <Link
                      to="/about"
                      className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold"
                    >
                      About
                    </Link>
                    <Link
                      to="/services"
                      className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold"
                    >
                      Services
                    </Link>
                    <Link
                      to="/contact"
                      className="nav-link relative text-dark uppercase text-xs tracking-2 leading-3 font-semibold"
                    >
                      Contact
                    </Link>
                  </div>

                  {/* User Profile or Login button */}
                  <div className="flex items-center space-x-4">
                    {/* User Profile */}
                    {user ? (
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <img
                              className="h-8 w-8 rounded-full object-cover text-xs uppercase"
                              src={`${
                                import.meta.env.VITE_BACKEND_URL
                              }/uploads/${user.profileImage}`}
                              alt={user.name.split(" ")[0]}
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-50 mt-2 w-48 origin-top-right bg-white divide-y divide-gray-100 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-4 py-3">
                              <p className="text-xs">Signed in as</p>
                              <p className="text-sm font-semibold">
                                {user.name}
                              </p>
                            </div>
                            <div className="py-2">
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to={
                                      user.role === "admin"
                                        ? "/dashboard"
                                        : "/client/dashboard"
                                    }
                                    className={`block px-4 py-2 text-sm ${
                                      active ? "bg-gray-100" : ""
                                    }`}
                                  >
                                    Dashboard
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to="/update-profile"
                                    className={`block px-4 py-2 text-sm ${
                                      active ? "bg-gray-100" : ""
                                    }`}
                                  >
                                    Update Profile
                                  </Link>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <Link
                                    to="/change-password"
                                    className={`block px-4 py-2 text-sm ${
                                      active ? "bg-gray-100" : ""
                                    }`}
                                  >
                                    Change Password
                                  </Link>
                                )}
                              </Menu.Item>
                              <div className=" mx-4 mt-2">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      onClick={logout}
                                      className={`btn-primary w-full uppercase text-white hover:text-dark text-center px-4 py-2 text-xs ${
                                        active ? "bg-gray-100" : ""
                                      }`}
                                    >
                                      Logout
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    ) : (
                      <Link
                        to="/login"
                        className="text-dark text-base border border-dark hover:text-white hover:bg-dark transition py-2 px-7"
                      >
                        Login
                      </Link>
                    )}

                    {/* Mobile Hamburger */}
                    <div className="lg:hidden">
                      <Disclosure.Button className="inline-flex items-center justify-center p-2 text-dark hover:text-primary bg-primary hover:bg-transparent border border-primary focus:outline-none transition">
                        {open ? (
                          <XMarkIcon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        ) : (
                          <Bars3Icon
                            className="block h-6 w-6"
                            aria-hidden="true"
                          />
                        )}
                      </Disclosure.Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <Disclosure.Panel className="lg:hidden fixed inset-0 top-[120px] bg-main z-50 overflow-y-auto">
              <div className="flex flex-col item-center justify-center h-full px-5">
                <Link
                  to="/"
                  className="inline-block text-center font-light text-dark uppercase text-2xl md:text-4xl my-4 hover:text-primary transition"
                >
                  Home
                </Link>
                <Link
                  to="/portfolio"
                  className="inline-block text-center font-light text-dark uppercase text-2xl md:text-4xl my-4 hover:text-primary transition"
                >
                  Portfolio
                </Link>
                <Link
                  to="/about"
                  className="inline-block text-center font-light text-dark uppercase text-2xl md:text-4xl my-4 hover:text-primary transition"
                >
                  About
                </Link>
                <Link
                  to="/services"
                  className="inline-block text-center font-light text-dark uppercase text-2xl md:text-4xl my-4 hover:text-primary transition"
                >
                  Services
                </Link>
                <Link
                  to="/contact"
                  className="inline-block text-center font-light text-dark uppercase text-2xl md:text-4xl my-4 hover:text-primary transition"
                >
                  Contact
                </Link>
              </div>
            </Disclosure.Panel>
          </>
        );
      }}
    </Disclosure>
  );
};

export default Navbar;

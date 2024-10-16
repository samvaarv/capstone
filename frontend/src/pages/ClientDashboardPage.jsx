import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Star, CircleUserRound, Book, EllipsisVertical } from "lucide-react";

import Profile from "../components/Profile";
import ClientTestimonial from "./ClientTestimonial";
import ClientBooking from "./ClientBooking";

const tabs = [
  { id: "profile", label: "Profile", icon: CircleUserRound },
  { id: "bookings", label: "My Bookings", icon: Book },
  { id: "testimonial", label: "Reviews", icon: Star },
];

const ClientDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <section className="border-b border-dark">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="md:grid grid-cols-12 gap-4">
          <div
            className={`col-start-1 col-span-3 border-dark border-b md:border-b-0 md:border-r py-7 ${
              isCollapsed ? "md:hidden" : ""
            }`}
          >
            <div className="flex items-center justify-between sticky md:relative top-0 left-0 right-0 bg-white md:bg-transparent md:shadow-none shadow-md z-10 p-4">
              <h1 className="text-xl md:text-lg lg:text-xl uppercase font-bold">
                Dashboard
              </h1>
              <button onClick={toggleCollapse} className="md:hidden bg-gray-200 py-2">
                <EllipsisVertical className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            <div className={`md:pr-4 mt-5 ${isCollapsed ? "hidden" : ""}`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center text-left mb-2 px-4 py-3 w-full uppercase text-xs tracking-2 leading-3 font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-white bg-primary"
                      : "hover:text-white bg-gray-100/50 hover:bg-primary"
                  }`}
                >
                  <tab.icon className="mr-2 h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="col-start-4 col-span-9 py-7">
            {activeTab === "profile" && <Profile />}
            {activeTab === "bookings" && <ClientBooking />}
            {activeTab === "testimonial" && <ClientTestimonial />}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ClientDashboardPage;

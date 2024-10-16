import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/api/notifications");
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`/api/notifications/${notificationId}/read`);
      toast.success("Notification marked as read.");
      setNotifications((prev) =>
        prev.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error("Error marking notification as read", error);
    }
  };
  return (
    <>
      <section className="md:grid grid-cols-9 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-start-1 col-span-6 mb-10"
        >
          <h2 className="uppercase text-md md:text-xl font-semibold mb-4">
            Profile Information
          </h2>
          <div className="widget flex flex-wrap gap-4">
            <div>
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                  user.profileImage
                }`}
                alt={user.name}
                className="w-48"
              />
              <p className="text-xs mt-2">
                <span className="font-bold">Joined: </span>
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <strong className="uppercase mb-2 text-xs">Name:</strong>
              <p className="text-lg uppercase font-extralight mb-2">
                {user.name}
              </p>
              <strong className="uppercase mb-2 text-xs">Email:</strong>
              <p className="text-lg uppercase font-extralight mb-2">
                {user.email}
              </p>
              <Link
                to="/update-profile"
                className="block text-primary font-semibold text-xs uppercase underline underline-offset-4 hover:text-dark mt-5"
              >
                Update Profile
              </Link>
              <Link
                to="/change-password"
                className="block text-primary font-semibold text-xs uppercase underline underline-offset-4 hover:text-dark mt-4"
              >
                Change Password
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-start-7 col-span-3"
        >
          <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
            Notifications
          </h3>
          {notifications.length === 0 ? (
            <p className="text-xs">No notifications.</p>
          ) : (
            notifications.map((notification) => (
              <div key={notification._id} className="p-4 border border-dark mb-4">
                <p className="text-xs mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  Received on:{" "}
                  {new Date(notification.createdAt).toLocaleString()}
                </p>{" "}
                {/* Date and time */}
                <button
                  onClick={() => markAsRead(notification._id)}
                  className="mt-4 block text-xs text-primary text-primary uppercase border border-primary px-5 py-2 underline-offset-2 hover:text-white hover:bg-primary transition"
                >
                  Mark as Read
                </button>
              </div>
            ))
          )}
        </motion.div>
      </section>
    </>
  );
};

export default Profile;

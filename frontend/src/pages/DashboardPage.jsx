import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { formatDate } from "../utils/date";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const BACKEND_URL = "http://localhost:8888"; // Base URL for the backend

  const handleLogout = () => {
    logout();
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full mx-auto mt-10 p-8 bg-gray-900 bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl border border-gray-800"
    >
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text">
        Dashboard
      </h2>

      {/* Role-based Navigation */}
      {user.role === "admin" ? (
        <nav className="mb-6">
          <ul className="space-y-2">
            <li>
              <Link to="/portfolio" className="text-green-400 hover:underline">
                Manage Portfolio
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-green-400 hover:underline">
                Manage About Section
              </Link>
            </li>
            <li>
              <Link
                to="/experience"
                className="text-green-400 hover:underline"
              >
                Manage Experience
              </Link>
            </li>
            <li>
              <Link to="/manage-services" className="text-green-400 hover:underline">
                Manage Services
              </Link>
            </li>
            <li>
              <Link to="/booking" className="text-green-400 hover:underline">
                Manage Booking
              </Link>
            </li>
            <li>
              <Link to="/inquiries" className="text-green-400 hover:underline">
                View Inquiries
              </Link>
            </li>
          </ul>
        </nav>
      ) : (
        <nav className="mb-6">
          <ul className="space-y-2">
            <li>
              <Link
                to="/client/booking"
                className="text-green-400 hover:underline"
              >
                My Bookings
              </Link>
            </li>
            <li>
              <Link
                to="/client/inquiries"
                className="text-green-400 hover:underline"
              >
                My Inquiries
              </Link>
            </li>
          </ul>
        </nav>
      )}

      <div className="space-y-6">
        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            Profile Information
          </h3>
          <img src={`${BACKEND_URL}/uploads/${user.profileImage}`}/>
          <p className="text-gray-300">Name: {user.name}</p>
          <p className="text-gray-300">Email: {user.email}</p>
        </motion.div>
        <motion.div
          className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-green-400 mb-3">
            Account Activity
          </h3>
          <p className="text-gray-300">
            <span className="font-bold">Joined: </span>
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-gray-300">
            <span className="font-bold">Last Login: </span>

            {formatDate(user.lastLogin)}
          </p>
        </motion.div>
      </div>
      <div>
        <Link to="/update-profile" className="text-green-400 hover:underline">
          <button>Update Profile</button>
        </Link>
        <Link to="/change-password" className="text-green-400 hover:underline">
          <button>Change Password</button>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
				font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700
				 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
export default DashboardPage;

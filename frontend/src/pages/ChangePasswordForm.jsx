import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ChangePasswordForm = () => {
  const { user, error } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordMatchMessage, setShowPasswordMatchMessage] =
    useState(false); // New state for controlling password match message visibility
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
      });

      // Show success toast notification
      toast.success("Password changed successfully");

      // Redirect to the appropriate dashboard
      if (user.role === "admin") {
        navigate("/dashboard"); // Admin dashboard
      } else {
        navigate("/client/dashboard"); // Client dashboard
      }
    } catch (error) {
      console.error("Error changing password", error);
      if (error.response?.status === 400) {
        toast.error(
          "Failed to change password: " + error.response.data.message
        ); // Show specific error message
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setShowPasswordMatchMessage(true); // Show password match message when typing in the confirm password field
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg w-full mx-auto"
    >
      <div className="p-10 md:py-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center font-light tracking-widest">
          CHANGE YOUR PASSWORD
        </h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Input
              label="CURRENT PASSWORD"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

          <div>
            <Input
              label="NEW PASSWORD"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              label="CONFIRM PASSWORD"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange} // Use the new handler
              required
            />

            {showPasswordMatchMessage && newPassword && (
              <p
                className={`mt-2 text-sm ${
                  newPassword === confirmPassword
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {newPassword === confirmPassword
                  ? "Passwords match!"
                  : "Passwords don't match!"}
              </p>
            )}
          </div>
          <div className="flex justify-center mt-6">
            <button
              className="mx-auto py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "CHANGING..." : "CHANGE PASSWORD"}
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default ChangePasswordForm;

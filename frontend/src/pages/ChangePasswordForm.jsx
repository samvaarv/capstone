import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Import toast for notifications
import Input from "../components/Input"; // Import the custom Input component
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
    <form onSubmit={handleSubmit}>
      <div>
        <label>Current Password</label>
        <Input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
      </div>
      {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

      <div>
        <label>New Password</label>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Confirm New Password</label>
        <Input
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

      <button type="submit" disabled={loading}>
        {loading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;

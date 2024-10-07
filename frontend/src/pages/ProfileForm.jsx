import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Make sure this is included in your App

const ProfileForm = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user.name);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await axios.put("/api/auth/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.user); // Update user info in the store
      toast.success("Profile updated successfully!");

      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (error) {
      console.error("Error updating profile", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Profile Image</label>
        <input type="file" onChange={handleImageUpload} />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default ProfileForm;

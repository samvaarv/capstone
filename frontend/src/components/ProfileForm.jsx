import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader } from "lucide-react";
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css"; // Make sure this is included in your App

const ProfileForm = () => {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user.name);
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch the image from the database on component mount
  useEffect(() => {
    const fetchImageFromDatabase = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/uploads/${user.profileImage}`
        );
        if (response.data && response.data.imageUrl) {
          setPreview(response.data.imageUrl); // Set the existing image URL
        }
      } catch (error) {
        console.error("Error fetching image from database:", error);
      } finally {
        setLoading(false); // Stop loading state
      }
    };

    fetchImageFromDatabase();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setProfileImage(file); // Set selected file in state

      const filePreviewUrl = URL.createObjectURL(file);
      console.log("Blob URL:", filePreviewUrl);
      setPreview(filePreviewUrl);
    } else {
      setProfileImage(null);
      setPreview(null);
    }
  };
  // Remove the uploaded file
  const handleRemove = () => {
    setProfileImage(null);
    setPreview(null); // Remove the preview
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
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg w-full mx-auto"
    >
      <div className="p-10 md:py-20">
        <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center font-main tracking-widest">
          PROFILE UPDATE
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            label="FULL NAME"
            type="text"
            placeholder="Full Name"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            label="Upload Image"
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
          />
          {/* Show loader while fetching the image */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            preview && (
              <div className="flex flex-col items-center mt-4">
                <img
                  src={preview}
                  alt="Selected Preview"
                  className="w-1/2 mx-auto h-auto rounded-md border border-gray-300"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={handleRemove}
                  className="mt-2 py-2 px-4 w-52 bg-red-500 text-white text-sm uppercase hover:bg-red-600 transition duration-200"
                >
                  Remove Image
                </button>
              </div>
            )
          )}
          <div className="flex justify-center mt-6">
            <button
              className="w-auto mx-auto py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
              type="submit"
              disabled={loading}
            >
              {loading ? "UPDATING..." : "UPDATE PROFILE"}
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default ProfileForm;

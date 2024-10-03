import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input"; // Ensure this path is correct
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExperienceManagement = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const [experiences, setExperiences] = useState([
    { number: "01", image: null, description: "" }, // Changed 'desc' to 'description'
  ]);
  const [gallery, setGallery] = useState([]);
  const [GalleryPreviews, setGalleryPreviews] = useState([]);
  const [experienceData, setExperienceData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

  const BACKEND_URL = "http://localhost:8888";

  // Fetch existing experience data
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const response = await axios.get(`/api/admin/experience`);
        if (response.data.success) {
          const {
            title,
            description,
            mainImage,
            caption,
            experiences,
            gallery,
          } = response.data.experience;
          // Populate state variables with fetched data
          setTitle(title);
          setDescription(description);
          setMainImage(mainImage);
          setMainImagePreview(`${BACKEND_URL}/uploads/${mainImage}}`); // Set image preview for editing
          setCaption(caption);
          setExperiences(experiences);
          setGallery(gallery);
          setExperienceData(response.data.experience);
        }
      } catch (error) {
        console.error("Error fetching experience content:", error);
      }
    };

    fetchExperience();
  }, []);

  // Handle image uploads
  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    setMainImage(file);
    setMainImagePreview(URL.createObjectURL(file));
  };

  const handleExperienceImageUpload = (index, event) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index].image = event.target.files[0];
    setExperiences(updatedExperiences);
  };

  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files);
    setGallery(files);
    // Create image preview URLs
    const previews = files.map((file) => URL.createObjectURL(file));
    setGalleryPreviews(previews);
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[index][field] = value; // Updates the correct field
    setExperiences(updatedExperiences);
  };

  const handleAddExperience = () => {
    const newExperience = {
      number: (experiences.length + 1).toString().padStart(2, "0"), // Leading zero
      image: null, // Placeholder, you'll populate this on upload
      description: "", // Placeholder, you'll populate this on input
    };
    setExperiences([...experiences, newExperience]);
  };

  const handleRemoveExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate required fields
    if (!title || !description || !mainImage || experiences.length === 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    for (const exp of experiences) {
      if (!exp.number || !exp.image || !exp.description) {
        toast.error("All experience fields must be filled.");
        return;
      }
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("mainImage", mainImage); // Ensure this is a file
    formData.append("caption", caption);

    // Prepare experiences data
    const experiencesData = experiences.map((exp) => {
      return {
        number: exp.number, // Ensure this is correctly populated
        image: exp.image ? exp.image.name : "", // Use filename for string field
        description: exp.description, // Ensure this is filled correctly
      };
    });

    formData.append("experiences", JSON.stringify(experiencesData));

    // Prepare gallery data
    const galleryData = gallery.map((img) => img.name); // Assuming gallery is an array of image filenames
    formData.append("gallery", JSON.stringify(galleryData));

    try {
      const response = await axios.post(`/api/admin/experience`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Set experienceData to the newly created experience
      setExperienceData(response.data.experience);
      toast.success("Experience added successfully");
      resetForm(); // Clear the form after successful submission
    } catch (error) {
      console.error("Error adding experience:", error.response.data);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setMainImage(null);
    setCaption("");
    setExperiences([{ number: "01", image: null, description: "" }]); // Reset to default
    setGallery([]);
  };

  const handleEdit = () => {
    // Populate the form with existing experience data when editing
    setIsEditing(true);
    if (experienceData) {
      setTitle(experienceData.title);
      setDescription(experienceData.description);
      setMainImage(experienceData.mainImage);
      setCaption(experienceData.caption);
      setExperiences(
        experienceData.experiences.map((exp) => ({
          ...exp,
          number: exp.number, // Ensure number is preserved
        }))
      );
      setGallery(experienceData.gallery); // Assuming gallery is an array of image filenames
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    resetForm();
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin/experience/${experienceData._id}`); // Pass the correct ID here
      toast.success("Experience content deleted successfully");

      resetForm();
      setExperienceData(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error deleting experience content:", error);
    }
  };

  return (
    <div>
      <ToastContainer />

      {/* Experience Form */}
      {!experienceData || isEditing ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full mt-2 p-2 border border-gray-300 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="mt-4">
            <label className="block mb-2">Upload Main Image</label>
            <input
              type="file"
              onChange={handleMainImageUpload}
              accept="image/*"
            />
            {mainImagePreview && (
              <img
                src={mainImagePreview}
                alt="Main Image Preview"
                className="w-full mt-2"
              />
            )}
          </div>
          <div className="mt-4">
            <label className="block mb-2">Caption</label>
            <Input
              type="text"
              placeholder="Caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>

          <h4 className="font-bold mt-4">Experiences</h4>
          {experiences.map((experience, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
                placeholder={`Experience ${experience.number} Description`}
                value={experience.description} // Update here
                onChange={
                  (e) =>
                    handleExperienceChange(index, "description", e.target.value) // Ensure this is updated correctly
                }
              />
              <input
                type="file"
                onChange={(e) => handleExperienceImageUpload(index, e)}
                accept="image/*"
                className="ml-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
                className="ml-2 bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 bg-green-500 text-white py-1 px-4 rounded"
            onClick={handleAddExperience}
          >
            Add Experience
          </button>

          <h4 className="font-bold mt-4">Gallery</h4>
          <input
            type="file"
            onChange={handleGalleryUpload}
            multiple
            accept="image/*"
          />
          <div className="mt-4">
            <label className="block mb-2">Upload Gallery Images (max 6)</label>
            <div className="flex space-x-2 mb-4">
              {GalleryPreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt="Gallery Preview"
                  className="h-16 w-16 object-cover"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            {isEditing ? "Save Changes" : "Add Experience"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="mt-4 ml-2 bg-gray-500 text-white py-2 px-4 rounded"
              onClick={handleCancelEdit}
            >
              Cancel Changes
            </button>
          )}
        </form>
      ) : (
        /* Experience Preview */
        <div>
          <h2 className="text-2xl font-bold mb-4">{experienceData.title}</h2>
          <p>{experienceData.description}</p>
          <img
            src={`${BACKEND_URL}/uploads/${experienceData.mainImage}`}
            alt="Main Experience"
            className="w-full mb-4"
          />
          <h4 className="font-bold">{experienceData.caption}</h4>

          <h4 className="font-bold mt-4">Experiences</h4>
          <ul>
            {experienceData.experiences.map((exp, index) => (
              <li key={index}>
                {exp.number}. {exp.description}
                <img
                  src={`${BACKEND_URL}/uploads/${exp.image}`}
                  alt={`Experience ${index + 1}`}
                  className="w-full mb-2"
                />
              </li>
            ))}
          </ul>

          <h4 className="font-bold mt-4">Gallery</h4>
          <div className="flex space-x-2">
            {experienceData.gallery.map((img, index) => (
              <img
                key={index}
                src={`${BACKEND_URL}/uploads/${img}`}
                alt={`Gallery ${index + 1}`}
                className="h-16 w-16 object-cover"
              />
            ))}
          </div>

          <button
            onClick={handleEdit}
            className="mt-4 bg-blue-500 text-white py-1 px-4 rounded"
          >
            Edit Experience
          </button>
          <button
            onClick={() => setDeleteConfirmationOpen(true)}
            className="mt-4 ml-2 bg-red-500 text-white py-1 px-4 rounded"
          >
            Delete Experience
          </button>

          {/* Confirmation Modal */}
          {deleteConfirmationOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                  Are you sure you want to delete this experience content?
                </h3>
                <div className="flex justify-between">
                  <button
                    onClick={() => setDeleteConfirmationOpen(false)}
                    className="bg-gray-300 text-gray-800 py-1 px-3 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="bg-red-600 text-white py-1 px-3 rounded"
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExperienceManagement;

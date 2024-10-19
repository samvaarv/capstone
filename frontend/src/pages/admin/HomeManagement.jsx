import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Input from "../../components/Input";

const HomeManagement = () => {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroImage1, setHeroImage1] = useState(null);
  const [heroImage2, setHeroImage2] = useState(null);
  const [heroImage1Preview, setHeroImage1Preview] = useState(null);
  const [heroImage2Preview, setHeroImage2Preview] = useState(null);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [aboutImage, setAboutImage] = useState(null);
  const [aboutImagePreview, setAboutImagePreview] = useState(null);
  const [instagramBigImage, setInstagramBigImage] = useState(null);
  const [instagramBigImagePreview, setInstagramBigImagePreview] =
    useState(null);
  const [instagramSmallImages, setInstagramSmallImages] = useState([]);
  const [instagramSmallImagesPreviews, setInstagramSmallImagesPreviews] =
    useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [homepageId, setHomepageId] = useState(null);
  const [showForm, setShowForm] = useState(true);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const maxImages = 4;

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        const response = await axios.get("/api/admin/homepage");
        if (response.data.homepage) {
          const {
            heroTitle,
            heroDescription,
            heroImage1,
            heroImage2,
            aboutTitle,
            aboutDescription,
            aboutImage,
            instagramBigImage,
            instagramSmallImages,
            _id,
          } = response.data.homepage;

          setHeroTitle(heroTitle);
          setHeroDescription(heroDescription);
          setHeroImage1Preview(
            `${import.meta.env.VITE_BACKEND_URL}/uploads/${heroImage1}`
          );
          setHeroImage2Preview(
            `${import.meta.env.VITE_BACKEND_URL}/uploads/${heroImage2}`
          );
          setAboutTitle(aboutTitle);
          setAboutDescription(aboutDescription);
          setAboutImagePreview(
            `${import.meta.env.VITE_BACKEND_URL}/uploads/${aboutImage}`
          );
          setInstagramBigImagePreview(
            `${import.meta.env.VITE_BACKEND_URL}/uploads/${instagramBigImage}`
          );
          setInstagramSmallImagesPreviews(
            instagramSmallImages.map(
              (img) => `${import.meta.env.VITE_BACKEND_URL}/uploads/${img}`
            )
          );
          setHomepageId(_id); // Set the ID for updating
          setIsEditing(true);
          setShowForm(false); // Show preview after loading the data
        }
      } catch (error) {
        console.error("Error fetching homepage data:", error);
      }
    };

    fetchHomepageData();
  }, []);

  // Handle form submission (add/update)
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("heroTitle", heroTitle);
    formData.append("heroDescription", heroDescription);
    if (heroImage1) formData.append("heroImage1", heroImage1);
    if (heroImage2) formData.append("heroImage2", heroImage2);
    formData.append("aboutTitle", aboutTitle);
    formData.append("aboutDescription", aboutDescription);
    if (aboutImage) formData.append("aboutImage", aboutImage);
    if (instagramBigImage)
      formData.append("instagramBigImage", instagramBigImage);
    if (instagramSmallImages.length > 0) {
      instagramSmallImages.forEach((image) => {
        formData.append("instagramSmallImages", image);
      });
    }

    try {
      if (isEditing) {
        // Update existing homepage data
        await axios.put(`/api/admin/homepage/${homepageId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Homepage updated successfully");
      } else {
        // Create new homepage data
        await axios.post("/api/admin/homepage", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Homepage created successfully");
      }
      setShowForm(false); // Show preview after submission
    } catch (error) {
      console.error("Error saving homepage data:", error);
    }
  };

  // Delete homepage data
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/admin/homepage/${homepageId}`);
      alert("Homepage deleted successfully");
      resetForm();
    } catch (error) {
      console.error("Error deleting homepage:", error);
    }
  };

  const resetForm = () => {
    setHeroTitle("");
    setHeroDescription("");
    setHeroImage1(null);
    setHeroImage2(null);
    setAboutTitle("");
    setAboutDescription("");
    setAboutImage(null);
    setInstagramBigImage(null);
    setInstagramSmallImages([]);
    setIsEditing(false);
    setHomepageId(null);
    setShowForm(true);
    setShowDeletePopup(false);
  };
  // Image preview handlers
  const handleHeroImage1Change = (e) => {
    const file = e.target.files[0];
    setHeroImage1(file);
    setHeroImage1Preview(URL.createObjectURL(file));
  };

  const handleHeroImage2Change = (e) => {
    const file = e.target.files[0];
    setHeroImage2(file);
    setHeroImage2Preview(URL.createObjectURL(file));
  };

  const handleAboutImageChange = (e) => {
    const file = e.target.files[0];
    setAboutImage(file);
    setAboutImagePreview(URL.createObjectURL(file));
  };

  const handleInstagramBigImageChange = (e) => {
    const file = e.target.files[0];
    setInstagramBigImage(file);
    setInstagramBigImagePreview(URL.createObjectURL(file));
  };

  const handleInstagramSmallImagesChange = (e) => {
    const files = Array.from(event.target.files);

    // Check if the total number of selected images exceeds the limit
    if (files.length + instagramSmallImages.length > maxImages) {
      setErrorMessage(`You can upload up to ${maxImages} images only.`);
      return;
    }

    setErrorMessage(""); // Clear any previous errors

    // Store selected images and create preview URLs
    setInstagramSmallImages([...instagramSmallImages, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setInstagramSmallImagesPreviews([
      ...instagramSmallImagesPreviews,
      ...previews,
    ]);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        Manage Homepage
      </h3>
      {showForm ? (
        <form onSubmit={handleSubmit}>
          {/* Form fields for homepage data */}
          <Input
            label="Hero Title"
            type="text"
            placeholder="Hero Title"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            required
          />
          <Input
            label="Hero Description"
            type="textarea"
            placeholder="Hero Description"
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            required
          />
          <div className="mb-6">
            <Input
              label="Upload Hero Main Image"
              type="file"
              onChange={handleHeroImage1Change}
              accept="image/*"
              required
            />
            {heroImage1Preview && (
              <img
                src={heroImage1Preview}
                alt="Hero 1 Preview"
                className="sm:w-1/4 mt-2"
              />
            )}
          </div>
          <div className="mb-6">
            <Input
              label="Upload Hero Sub Image"
              type="file"
              onChange={handleHeroImage2Change}
              accept="image/*"
              required
            />
            {heroImage2Preview && (
              <img
                src={heroImage2Preview}
                alt="Hero 2 Preview"
                className="sm:w-1/4 mt-2"
              />
            )}
          </div>
          <Input
            label="About Title"
            type="text"
            placeholder="About Title"
            value={aboutTitle}
            onChange={(e) => setAboutTitle(e.target.value)}
            required
          />
          <Input
            label="About DEscription"
            type="textarea"
            placeholder="About DEscription"
            value={aboutDescription}
            onChange={(e) => setAboutDescription(e.target.value)}
            required
          />
          <div className="mb-6">
            <Input
              label="Upload Hero Sub Image"
              type="file"
              onChange={handleAboutImageChange}
              accept="image/*"
              required
            />
            {aboutImagePreview && (
              <img
                src={aboutImagePreview}
                alt="About Preview"
                className="sm:w-1/4 mt-2"
              />
            )}
          </div>
          <div className="mb-6">
            <Input
              label="Upload Instagram Big Image"
              type="file"
              onChange={handleInstagramBigImageChange}
              accept="image/*"
              required
            />
            {instagramBigImagePreview && (
              <img
                src={instagramBigImagePreview}
                alt="Instagram Big"
                className="sm:w-1/4 mt-2"
              />
            )}
          </div>
          <div className="mb-6">
            <Input
              label="Upload Instagram Sub Images (Select only 4)"
              type="file"
              multiple
              onChange={handleInstagramSmallImagesChange}
              accept="image/*"
              required
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <div className="flex flex-wrap gap-4">
              {instagramSmallImagesPreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Instagram Small ${index}`}
                  className="sm:w-1/5 mt-2"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary uppercase py-3 px-10 text-dark border-2 mr-2 font-semibold text-xs tracking-2 transition duration-200"
          >
            {isEditing ? "Save Changes" : "Create Homepage"}
          </button>
        </form>
      ) : (
        <div className="uppercase">
          <h5 className="font-bold text-sm mb-1">Hero Title</h5>
          <p className="mb-4">{heroTitle}</p>
          <h5 className="font-bold text-sm mb-1">Hero Description</h5>
          <p className="mb-4"> {heroDescription}</p>
          <h5 className="font-bold text-sm mb-1">Hero Main Image</h5>
          {heroImage1Preview && (
            <img
              src={heroImage1Preview}
              alt="Hero 1"
              className="sm:w-1/3 mb-6"
            />
          )}
          <h5 className="font-bold text-sm mb-1">Hero sub Image</h5>
          {heroImage2Preview && (
            <img
              src={heroImage2Preview}
              alt="Hero 2"
              className="sm:w-1/3 mb-6"
            />
          )}
          <h5 className="font-bold text-sm mb-1">About Title</h5>
          <p className="mb-4">{aboutTitle}</p>
          <h5 className="font-bold text-sm mb-1">About Description</h5>
          <p className="mb-4">{aboutDescription}</p>
          <h5 className="font-bold text-sm mb-1">About Image</h5>
          {aboutImagePreview && (
            <img
              src={aboutImagePreview}
              alt="About"
              className="sm:w-1/3 mb-6"
            />
          )}
          <h5 className="font-bold text-sm mb-1">Instagram Main Image</h5>
          {instagramBigImagePreview && (
            <img
              src={instagramBigImagePreview}
              alt="Instagram Big"
              className="sm:w-1/3 mb-6"
            />
          )}
          <h5 className="font-bold text-sm mb-1">Instagram Small Images</h5>
          <div className="flex flex-wrap gap-4">
            {instagramSmallImagesPreviews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Instagram Small ${index}`}
                className="sm:w-1/5 mb-6"
              />
            ))}
          </div>
          <button
            className="text-xs py-3 px-10 text-dark uppercase hover:text-white hover:bg-dark text-white border-2 border-dark transition duration-200 mr-2"
            onClick={() => setShowForm(true)}
          >
            Edit Home
          </button>
          <button
            className="text-xs py-3 px-10 bg-red-500 text-white uppercase border-2 border-red-600 hover:bg-red-600 transition duration-200"
            onClick={() => setShowDeletePopup(true)}
          >
            Delete Home
          </button>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div>
          <p>Are you sure you want to delete this homepage?</p>
          <button onClick={handleDelete}>Confirm</button>
          <button onClick={() => setShowDeletePopup(false)}>Cancel</button>
        </div>
      )}
    </motion.section>
  );
};

export default HomeManagement;

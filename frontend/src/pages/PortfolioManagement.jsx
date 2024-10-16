import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PortfolioManagement = () => {
  // State for adding a new portfolio
  const [newTitle, setNewTitle] = useState(""); // Title for new portfolio
  const [newImages, setNewImages] = useState([]); // Images for new portfolio
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Image previews for new portfolio

  // State for managing existing portfolios
  const [portfolios, setPortfolios] = useState([]);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [portfolioToDelete, setPortfolioToDelete] = useState(null);
  const [portfolioDetails, setPortfolioDetails] = useState(null); // Details for delete confirmation
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [editingImages, setEditingImages] = useState([]); // New images uploaded during edit
  const [editingImagePreviews, setEditingImagePreviews] = useState([]); // Image previews during edit
  const [editingTitle, setEditingTitle] = useState(""); // Title for editing portfolio
  const [existingImages, setExistingImages] = useState([]); // Existing image previews

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get(`/api/admin/manage-portfolio`);
        if (response.data.success) {
          setPortfolios(response.data.portfolios);
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      }
    };

    fetchPortfolios();
  }, []);

  // Handle image upload for adding a new portfolio
  const handleNewImageUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setNewImages(selectedFiles);

    // Create image preview URLs
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setNewImagePreviews(previews);
  };

  // Handle adding a new portfolio
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", newTitle); // Use newTitle for new portfolio

    newImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post(`/api/admin/manage-portfolio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Portfolio added successfully");
      // Reset form
      resetNewPortfolioForm();
      // Re-fetch portfolios
      const response = await axios.get(`/api/admin/manage-portfolio`);
      setPortfolios(response.data.portfolios);
    } catch (error) {
      console.error("Error adding portfolio:", error);
    }
  };

  // Reset new portfolio form
  const resetNewPortfolioForm = () => {
    setNewTitle(""); // Clear title state
    setNewImages([]); // Clear new images
    setNewImagePreviews([]); // Clear image previews
  };

  // Handle edit button click
  const handleEdit = (portfolio) => {
    setEditingPortfolio(portfolio);
    setEditingTitle(portfolio.title); // Set title for editing
    setExistingImages(
      portfolio.images.map(
        (image) => `${import.meta.env.VITE_BACKEND_URL}/uploads/${image}`
      )
    );
    setEditingImages([]); // Reset editing images
    setEditingImagePreviews([]); // Reset image previews for editing
  };

  // Handle edit image upload
  const handleEditingImageUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setEditingImages(selectedFiles);

    // Create image preview URLs
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setEditingImagePreviews(previews);
  };

  // Handle edit submission
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("title", editingTitle); // Use editingTitle for the edited portfolio

    // Append new images (if any)
    editingImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.put(
        `/api/admin/manage-portfolio/${editingPortfolio._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Portfolio updated successfully");

      // Reset form and editing state
      resetEditMode();
      // Re-fetch portfolios
      const response = await axios.get(`/api/admin/manage-portfolio`);
      setPortfolios(response.data.portfolios);
    } catch (error) {
      console.error("Error updating portfolio:", error);
    }
  };

  // Reset edit mode
  const resetEditMode = () => {
    setEditingPortfolio(null);
    setEditingTitle(""); // Clear editing title state
    setEditingImages([]); // Clear editing images
    setEditingImagePreviews([]); // Clear image previews for editing
    setExistingImages([]); // Clear existing images
  };

  // Handle delete confirmation
  const handleDelete = (portfolio) => {
    setPortfolioToDelete(portfolio._id);
    setPortfolioDetails(portfolio);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin/manage-portfolio/${portfolioToDelete}`);
      toast.success("Portfolio deleted successfully");
      setDeleteConfirmationOpen(false);
      const response = await axios.get(`/api/admin/manage-portfolio`);
      setPortfolios(response.data.portfolios);
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
          Add new Portfolio
        </h3>

        {/* New Portfolio Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <Input
          label="Portfolio Title"
            type="text"
            placeholder="Portfolio Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)} // Use newTitle state
            required
          />
          <Input
            label="Upload Image"
            multiple
            type="file"
            onChange={handleNewImageUpload}
            accept="image/*"
            required
          />
          <button
            type="submit"
            className="w-auto mx-auto py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
          >
            ADD PORTFOLIO
          </button>
        </form>
        {/* Preview of new images */}
        <div className="flex space-x-2 mb-4">
          {newImagePreviews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt="New Portfolio Preview"
              className="h-16 w-16 object-cover"
            />
          ))}
        </div>

        <h3 className="text-xl uppercase font-semibold mb-4">Existing Portfolios</h3>
        {portfolios.length > 0 ? (
          <ul className="space-y-4">
            {portfolios.map((portfolio) => (
              <li key={portfolio._id} className="p-4 border border-dark">
                {editingPortfolio && editingPortfolio._id === portfolio._id ? (
                  <form onSubmit={handleEditSubmit} className="mb-6">
                    <Input
                      type="text"
                      placeholder="Portfolio Title"
                      value={editingTitle} // Use editingTitle for the editing form
                      onChange={(e) => setEditingTitle(e.target.value)} // Update editingTitle for editing
                      required
                    />

                    {/* New image upload */}
                    <Input
                      label="Upload Image"
                      multiple
                      type="file"
                      onChange={handleEditingImageUpload}
                      accept="image/*"
                      required
                    />
                    {/* Existing images */}
                    <div className="flex flex-wrap w-full gap-2 mb-2">
                      {existingImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Existing ${editingPortfolio.title}-${
                            index + 1
                          }`}
                          className="h-16 w-16 object-cover"
                        />
                      ))}
                    </div>

                    {/* New image previews */}
                    <div className="flex flex-wrap w-full gap-2 mb-2">
                      {editingImagePreviews.map((preview, index) => (
                        <img
                          key={index}
                          src={preview}
                          alt={`New preview-${index + 1}`}
                          className="h-16 w-full object-cover"
                        />
                      ))}
                    </div>

                    <button
                      type="submit"
                      className="btn-primary uppercase py-3 px-8 text-dark border-2 mr-2 font-semibold text-xs tracking-2 transition duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={resetEditMode} // Cancel changes and exit edit mode
                      className="w-auto mx-auto uppercase py-3 px-8 text-dark hover:text-white border border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
                    >
                      Cancel Changes
                    </button>
                  </form>
                ) : (
                  <>
                    <h4 className="font-bold uppercase mb-4">
                      {portfolio.title}
                    </h4>
                    <div className="flex flex flex-wrap w-full mb-4 gap-2 mb-2">
                      {portfolio.images.map((image, index) => (
                        <img
                          key={index}
                          src={`${
                            import.meta.env.VITE_BACKEND_URL
                          }/uploads/${image}`}
                          alt={`Portfolio ${portfolio.title}-${index + 1}`}
                          className="h-16 w-16 object-cover"
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => handleEdit(portfolio)} // Start editing this portfolio
                      className="text-xs py-2 px-4 text-dark text-sm uppercase hover:text-white hover:bg-dark text-white border-2 border-dark transition duration-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(portfolio)} // Start deleting this portfolio
                      className="text-xs py-2 px-4 bg-red-500 text-white text-sm uppercase border-2 border-red-600 hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs mb-4">No portfolios found.</p>
        )}

        {/* Confirmation Modal */}
        {deleteConfirmationOpen && portfolioDetails && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 shadow-md w-full sm:w-2/3 lg:w-1/2 ">
              <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to delete this portfolio?
              </h3>
              <h4 className="font-semibold uppercase mb-2">
                {portfolioDetails.title}
              </h4>
              <div className="flex space-x-2 mb-2">
                {portfolioDetails.images.slice(0, 3).map((image, index) => (
                  <img
                    key={index}
                    src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${image}`} // Use the backend URL for the images
                    alt={`Preview ${portfolioDetails.title}-${index + 1}`}
                    className="h-16 w-16 object-cover"
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setDeleteConfirmationOpen(false)} // Close confirmation modal
                  className="text-dark text-xs uppercase py-2 px-5 border border-dark hover:text-white hover:bg-dark transition mt-3"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete} // Confirm delete action
                  className="bg-red-500 text-white text-xs uppercase py-2 px-5 hover:bg-red-700 transition mt-3"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.section>
    </>
  );
};

export default PortfolioManagement;

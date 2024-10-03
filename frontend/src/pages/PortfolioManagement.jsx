import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input"; // Ensure this path is correct
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Import the CSS for the toast notifications

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

  const BACKEND_URL = "http://localhost:8888"; // Base URL for the backend

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const response = await axios.get(`/api/admin/portfolio`);
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
      await axios.post(`/api/admin/portfolio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Portfolio added successfully");
      // Reset form
      resetNewPortfolioForm();
      // Re-fetch portfolios
      const response = await axios.get(`/api/admin/portfolio`);
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
      portfolio.images.map((image) => `${BACKEND_URL}/uploads/${image}`)
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
        `/api/admin/portfolio/${editingPortfolio._id}`,
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
      const response = await axios.get(`/api/admin/portfolio`);
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
      await axios.delete(`/api/admin/portfolio/${portfolioToDelete}`);
      toast.success("Portfolio deleted successfully");
      setDeleteConfirmationOpen(false);
      const response = await axios.get(`/api/admin/portfolio`);
      setPortfolios(response.data.portfolios);
    } catch (error) {
      console.error("Error deleting portfolio:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-4">Manage Portfolios</h2>

      {/* New Portfolio Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <Input
          type="text"
          placeholder="Portfolio Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)} // Use newTitle state
          required
        />
        <input
          type="file"
          multiple
          onChange={handleNewImageUpload}
          className="mt-4"
          accept="image/*"
          required
        />
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Portfolio
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

      <h3 className="text-xl font-semibold mb-2">Existing Portfolios</h3>
      {portfolios.length > 0 ? (
        <ul className="space-y-4">
          {portfolios.map((portfolio) => (
            <li
              key={portfolio._id}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              {editingPortfolio && editingPortfolio._id === portfolio._id ? (
                <form onSubmit={handleEditSubmit} className="mb-6">
                  <Input
                    type="text"
                    placeholder="Portfolio Title"
                    value={editingTitle} // Use editingTitle for the editing form
                    onChange={(e) => setEditingTitle(e.target.value)} // Update editingTitle for editing
                    required
                  />
                  {/* Existing images */}
                  <div className="flex space-x-2 mb-2">
                    {existingImages.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Existing ${editingPortfolio.title}-${index + 1}`}
                        className="h-16 w-16 object-cover"
                      />
                    ))}
                  </div>

                  {/* New image upload */}
                  <input
                    type="file"
                    multiple
                    onChange={handleEditingImageUpload}
                    className="mt-4"
                    accept="image/*"
                  />

                  {/* New image previews */}
                  <div className="flex space-x-2 mb-4">
                    {editingImagePreviews.map((preview, index) => (
                      <img
                        key={index}
                        src={preview}
                        alt={`New preview-${index + 1}`}
                        className="h-16 w-16 object-cover"
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={resetEditMode} // Cancel changes and exit edit mode
                    className="mt-4 bg-gray-300 text-gray-800 py-2 px-4 rounded"
                  >
                    Cancel Changes
                  </button>
                </form>
              ) : (
                <>
                  <h4 className="font-bold">{portfolio.title}</h4>
                  <div className="flex space-x-2 mb-2">
                    {portfolio.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${BACKEND_URL}/uploads/${image}`}
                        alt={`Portfolio ${portfolio.title}-${index + 1}`}
                        className="h-16 w-16 object-cover"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => handleEdit(portfolio)} // Start editing this portfolio
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(portfolio)} // Start deleting this portfolio
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No portfolios found.</p>
      )}

      {/* Confirmation Modal */}
      {deleteConfirmationOpen && portfolioDetails && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this portfolio?
            </h3>
            <h4 className="font-bold">{portfolioDetails.title}</h4>
            <div className="flex space-x-2 mb-2">
              {portfolioDetails.images.slice(0, 3).map((image, index) => (
                <img
                  key={index}
                  src={`${BACKEND_URL}/uploads/${image}`} // Use the backend URL for the images
                  alt={`Preview ${portfolioDetails.title}-${index + 1}`}
                  className="h-16 w-16 object-cover"
                />
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setDeleteConfirmationOpen(false)} // Close confirmation modal
                className="bg-gray-300 text-gray-800 py-1 px-3 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete} // Confirm delete action
                className="bg-red-600 text-white py-1 px-3 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioManagement;

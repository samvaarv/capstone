import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceManagement = () => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newBookingLink, setNewBookingLink] = useState(
    "http://example.com/book"
  );
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState([]);

  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null); // Track the service being edited
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editBookingLink, setEditBookingLink] = useState(
    "http://example.com/book"
  );
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState([]);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null); // Store the service to be deleted

  const BACKEND_URL = "http://localhost:8888";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/admin/manage-services");
        if (response.data.success) {
          setServices(response.data.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    setNewImage(selectedFile);

    // Create image preview URL
    setNewImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleEditImageUpload = (event) => {
    const selectedFile = event.target.files[0];
    setEditImage(selectedFile);
    setEditImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("description", newDescription);
    formData.append("price", newPrice);
    formData.append("bookingLink", newBookingLink);
    formData.append("image", newImage);

    try {
      await axios.post("/api/admin/manage-services", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Service added successfully");
      setNewName("");
      setNewDescription("");
      setNewPrice("");
      setNewImage(null);
      const response = await axios.get("/api/admin/manage-services");
      setServices(response.data.services);
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service._id); // Track the service being edited
    setEditName(service.name);
    setEditDescription(service.description);
    setEditPrice(service.price);
    setEditBookingLink(service.bookingLink);
    setEditImage(null); // Clear any previously selected image for editing
    setEditImagePreview([]);
  };

  const handleEditSubmit = async (serviceId) => {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    formData.append("price", editPrice);
    formData.append("bookingLink", editBookingLink);

    if (editImage) {
      formData.append("image", editImage);
    }

    try {
      await axios.put(`/api/admin/manage-services/${serviceId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Service updated successfully");
      setEditingService(null); // Exit edit mode
      setEditImage(null); // Clear the image upload
      const response = await axios.get("/api/admin/manage-services");
      setServices(response.data.services);
    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  const handleDelete = (service) => {
    setServiceToDelete(service); // Store the service object for the modal
    setDeleteConfirmationOpen(true); // Open the delete confirmation popup
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin/manage-services/${serviceToDelete._id}`);
      toast.success("Service deleted successfully");
      setDeleteConfirmationOpen(false); // Close the confirmation modal
      const response = await axios.get("/api/admin/manage-services");
      setServices(response.data.services);
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false); // Close the confirmation modal without deleting
  };

  const handleCancelEdit = () => {
    setEditingService(null); // Exit edit mode
    setEditImage(null); // Clear the image upload
  };

  return (
    <div>
      <ToastContainer />

      {/* Add New Service Form */}
      <h2 className="text-2xl font-bold mb-4">Add New Service</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <Input
          type="text"
          placeholder="Service Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          required
        />
        <Input
          type="number"
          placeholder="Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Booking Link"
          value={newBookingLink}
          onChange={(e) => setNewBookingLink(e.target.value)}
          disabled
        />
        <input type="file" onChange={handleImageUpload} accept="image/*" />
        {newImage && (
          <img
            src={newImagePreview}
            alt="Preview Image"
            className="h-16 w-16 object-cover"
          />
        )}
        <button
          type="submit"
          className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
        >
          Add Service
        </button>
      </form>

      {/* List of Services */}
      <h3 className="text-xl font-semibold mb-2">Existing Services</h3>
      {services.length > 0 ? (
        <ul className="space-y-4">
          {services.map((service) => (
            <li
              key={service._id}
              className="p-4 bg-gray-800 rounded-lg border border-gray-700"
            >
              {/* Edit Mode */}
              {editingService === service._id ? (
                <div>
                  <Input
                    type="text"
                    placeholder="Service Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    required
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Booking Link"
                    value={editBookingLink}
                    onChange={(e) => setEditBookingLink(e.target.value)}
                    disabled
                  />
                  {/* Show existing image only if no new image is selected */}
    {!editImage && service.image && (
      <img
        src={`${BACKEND_URL}/uploads/${service.image}`}
        alt={`Existing service ${service.name}`}
        className="h-16 w-16 object-cover mt-2"
      />
    )}
                  <input
                    type="file"
                    onChange={handleEditImageUpload}
                    accept="image/*"
                  />

                  {/* New image preview (if a new image is uploaded) */}
                  {editImagePreview.length > 0 && (
  <img
    src={editImagePreview}
    alt="New service preview"
    className="h-16 w-16 object-cover mt-2"
  />
)}

                  <button
                    onClick={() => handleEditSubmit(service._id)}
                    className="mt-4 bg-blue-500 text-white py-1 px-3 rounded"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="mt-4 ml-2 bg-gray-500 text-white py-1 px-3 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                /* Normal View */
                <>
                  <h4 className="font-bold">{service.name}</h4>
                  <p>{service.description}</p>
                  <p>Price: ${service.price}</p>
                  <a
                    href={service.bookingLink}
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Booking Link
                  </a>
                  <img
                    src={`${BACKEND_URL}/uploads/${service.image}`}
                    alt={`Service ${service.name}`}
                    className="h-16 w-16 object-cover mt-2"
                  />
                  <button
                    onClick={() => handleEdit(service)}
                    className="bg-blue-500 text-white py-1 px-2 rounded mt-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="bg-red-500 text-white py-1 px-2 rounded mt-2"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No services found.</p>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationOpen && serviceToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this service?
            </h3>
            <h4 className="font-bold">{serviceToDelete.name}</h4>
            <p>{serviceToDelete.description}</p>
            <p>Price: ${serviceToDelete.price}</p>
            <img
              src={`${BACKEND_URL}/uploads/${serviceToDelete.image}`}
              alt={`Service ${serviceToDelete.name}`}
              className="h-16 w-16 object-cover mt-2"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 py-1 px-3 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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

export default ServiceManagement;

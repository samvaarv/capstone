import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServiceManagement = () => {
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState([]);

  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null); // Track the service being edited
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState([]);

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null); // Store the service to be deleted

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
    setEditImage(null); // Clear any previously selected image for editing
    setEditImagePreview([]);
  };

  const handleEditSubmit = async (serviceId) => {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("description", editDescription);
    formData.append("price", editPrice);

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
    <>
      <ToastContainer />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
          Add New Service
        </h3>
        <form onSubmit={handleSubmit} className="mb-6">
          <Input
            label="Service Tite"
            type="text"
            placeholder="Service Title"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />
          <Input
            label="Description"
            type="textarea"
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            required
          />
          <Input
            label="Price"
            type="number"
            placeholder="Price"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            required
          />
          <Input
            label="Upload Image"
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            required
          />
          <button
            type="submit"
            className="w-auto mx-auto py-3 px-16 text-dark hover:text-white border-2 border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
          >
            ADD SERVICE
          </button>
        </form>

        {newImage && (
          <img
            src={newImagePreview}
            alt="Preview Image"
            className="h-16 w-16 object-cover mb-10"
          />
        )}

        {/* List of Services */}
        <h3 className="text-xl uppercase font-semibold mb-4">
          Existing Services
        </h3>
        {services.length > 0 ? (
          <ul className="space-y-4">
            {services.map((service) => (
              <li key={service._id} className="relative p-4 border border-dark">
                {/* Edit Mode */}
                {editingService === service._id ? (
                  <div>
                    <Input
                      label="Service Title"
                      type="text"
                      placeholder="Service Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                    <Input
                      label="Description"
                      type="textarea"
                      placeholder="Description"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      required
                    />
                    <Input
                      label="Price"
                      type="number"
                      placeholder="Price"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      required
                    />
                    <Input
                      label="Upload Image"
                      type="file"
                      onChange={handleEditImageUpload}
                      accept="image/*"
                      required
                    />
                    {/* Show existing image only if no new image is selected */}
                    {!editImage && service.image && (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                          service.image
                        }`}
                        alt={`Existing service ${service.name}`}
                        className="h-16 w-16 object-cover my-4"
                      />
                    )}

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
                      className="btn-primary uppercase py-3 px-8 text-dark border-2 mr-2 font-semibold text-xs tracking-2 transition duration-200"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="w-auto mx-auto uppercase py-3 px-8 text-dark hover:text-white border border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  /* Normal View */
                  <>
                    <h4 className="font-bold uppercase mb-4">{service.name}</h4>
                    <p className="text-sm mb-4">{service.description}</p>
                    <p>
                      <strong>Price:</strong> ${service.price}
                    </p>
                    <img
                      src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                        service.image
                      }`}
                      alt={`Service ${service.name}`}
                      className="h-16 w-16 object-cover mt-2 mb-4"
                    />
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-xs py-2 px-4 text-dark hover:text-white text-sm uppercase hover:bg-dark text-white border-2 border-dark transition duration-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service)}
                      className="text-xs py-2 px-4 bg-red-500 text-white text-sm uppercase border-2 border-red-600 hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                    {deleteConfirmationOpen && serviceToDelete === service && (
                      <div className="absolute top-0 left-0 w-full h-full bg-white shadow-md p-4 rounded z-10">
                        <h3 className="text-lg font-semibold mb-4">
                          Are you sure you want to delete this service?
                        </h3>
                        <h4 className="font-semibold uppercase mb-2">
                          {service.name}
                        </h4>
                        <p className="text-xs mb-2">{service.description}</p>
                        <p>Price: ${service.price}</p>
                        <img
                          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                            service.image
                          }`}
                          alt={`Service ${service.name}`}
                          className="h-16 w-16 object-cover mt-2"
                        />
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={cancelDelete}
                            className="text-dark text-xs uppercase py-2 px-5 border border-dark hover:text-white hover:bg-dark transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={confirmDelete}
                            className="bg-red-500 text-white text-xs uppercase py-2 px-5 hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs mb-4">No services found.</p>
        )}
      </motion.section>
    </>
  );
};

export default ServiceManagement;

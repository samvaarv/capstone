import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const AboutManagement = () => {
  const [subHeading, setSubHeading] = useState("");
  const [heading, setHeading] = useState("");
  const [quote, setQuote] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image1, setImage1] = useState(null);
  const [image1Preview, setImage1Preview] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image2Preview, setImage2Preview] = useState(null);
  const [pros, setPros] = useState([""]);
  const [cons, setCons] = useState([""]);
  const [aboutData, setAboutData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(`/api/admin/manage-about`);
        if (response.data.success) {
          const {
            subHeading,
            heading,
            quote,
            title,
            description,
            image1,
            image2,
            pros,
            cons,
          } = response.data.about;

          setSubHeading(subHeading);
          setHeading(heading);
          setQuote(quote);
          setTitle(title);
          setDescription(description);
          setImage1(image1);
          setImage1Preview(
            `${import.meta.env.VITE_BACKEND_URL}/uploads/${image1}`
          );
          setImage2(image2);
          setImage2Preview(
            `${import.meta.env.VITE_BACKEND_URL}/uploads/${image2}`
          );
          setPros(pros);
          setCons(cons);
          setAboutData(response.data.about);
          setFormVisible(false); // Show preview if data exists
        }
      } catch (error) {
        console.error("Error fetching about content:", error);
      }
    };

    fetchAbout();
  }, []);

  // Handle image1 upload and preview
  const handleImage1Upload = (event) => {
    const file = event.target.files[0];
    setImage1(file);
    setImage1Preview(URL.createObjectURL(file));
  };

  // Handle image2 upload and preview
  const handleImage2Upload = (event) => {
    const file = event.target.files[0];
    setImage2(file);
    setImage2Preview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("subHeading", subHeading);
    formData.append("heading", heading);
    formData.append("quote", quote);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image1", image1);
    formData.append("image2", image2);
    formData.append("pros", JSON.stringify(pros));
    formData.append("cons", JSON.stringify(cons));

    try {
      if (isEditing) {
        // Update about content (PUT request)
        const response = await axios.put(
          `/api/admin/manage-about/${aboutData._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setAboutData(response.data.about);
        toast.success("About page updated successfully");
      } else {
        // Create new about content (POST request)
        const response = await axios.post(`/api/admin/manage-about`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAboutData(response.data.about);
        toast.success("About page added successfully");
      }

      setIsEditing(false);
      setFormVisible(false); // Hide form and show preview
    } catch (error) {
      console.error("Error saving about page:", error);
    }
  };

  const handleAddPro = () => {
    setPros([...pros, ""]);
  };

  const handleAddCon = () => {
    setCons([...cons, ""]);
  };

  const handleProChange = (index, value) => {
    const updatedPros = [...pros];
    updatedPros[index] = value;
    setPros(updatedPros);
  };

  const handleConChange = (index, value) => {
    const updatedCons = [...cons];
    updatedCons[index] = value;
    setCons(updatedCons);
  };

  const handleRemovePro = (index) => {
    const updatedPros = pros.filter((_, i) => i !== index);
    setPros(updatedPros);
  };

  const handleRemoveCon = (index) => {
    const updatedCons = cons.filter((_, i) => i !== index);
    setCons(updatedCons);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormVisible(true); // Show form for editing
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormVisible(false); // Hide form and show preview
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/admin/manage-about/${aboutData._id}`);
      toast.success("About content deleted successfully");

      resetForm();
      setAboutData(null);
      setIsEditing(false);
      setFormVisible(true); // Show form after deletion
    } catch (error) {
      console.error("Error deleting about content:", error);
    }
  };

  const resetForm = () => {
    setSubHeading("");
    setHeading("");
    setQuote("");
    setTitle("");
    setDescription("");
    setImage1(null);
    setImage2(null);
    setPros([""]);
    setCons([""]);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="uppercase text-md md:text-xl font-semibold mb-4">
        Manage About Page
      </h3>
      <ToastContainer />

      {formVisible ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Input
            label="SubHeading"
            type="text"
            placeholder="Sub Heading"
            value={subHeading}
            onChange={(e) => setSubHeading(e.target.value)}
            required
          />
          <Input
            label="HEADINg"
            type="text"
            placeholder="Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
          />
          <div className="mb-6">
            <Input
              label="Upload Hero Image"
              type="file"
              onChange={handleImage1Upload}
              accept="image/*"
              required
            />
            {image1Preview && (
              <img
                src={image1Preview}
                alt="Preview Image 1"
                className="sm:w-1/2 mt-2"
              />
            )}
          </div>
          <Input
            label="QUOTE"
            type="textarea"
            placeholder="Quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
          />
          <Input
            label="About Title"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            label="DESCRIPTION"
            type="textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="mt-4">
            <Input
              label="Upload About Image"
              type="file"
              onChange={handleImage2Upload}
              accept="image/*"
              required
            />
            {image2Preview && (
              <img
                src={image2Preview}
                alt="Preview Image 2"
                className="sm:w-1/2 mt-2"
              />
            )}
          </div>

          <h4 className="font-bold mt-4">Pros</h4>
          {pros.map((pro, index) => (
            <div key={index} className="flex items-center w-full mb-2">
              <div className="grow">
                <Input
                  type="text"
                  placeholder={`Pros ${index + 1}`}
                  value={pro}
                  onChange={(e) => handleProChange(index, e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemovePro(index)}
                className="ml-2 text-red-500 border border-red-500 px-10 py-3 mb-6 grow-0"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mb-6 bg-green-600 text-white py-2 px-8 hover:bg-green-700 transition "
            onClick={handleAddPro}
          >
            Add Pro
          </button>

          <h4 className="font-bold mt-4">Cons</h4>
          {cons.map((con, index) => (
            <div key={index} className="flex items-center w-full mb-2">
              <div className="grow">
                <Input
                  type="text"
                  placeholder={`Cons ${index + 1}`}
                  value={con}
                  onChange={(e) => handleConChange(index, e.target.value)}
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveCon(index)}
                className="ml-2 text-red-500 border border-red-500 px-10 py-3 mb-6 grow-0"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mb-6 bg-green-500 text-white py-2 px-8 hover:bg-green-700 transition"
            onClick={handleAddCon}
          >
            Add Con
          </button>

          <div className="mb-50">
            <button
              type="submit"
              className="btn-primary uppercase py-3 px-10 text-dark border-2 mr-2 font-semibold text-xs tracking-2 transition duration-200"
            >
              {isEditing ? "Save Changes" : "Add About"}
            </button>

            {isEditing && (
              <button
                type="button"
                className="w-auto mx-auto uppercase py-3 px-10 text-dark hover:text-white border border-dark font-semibold text-xs hover:bg-dark tracking-2 transition duration-200"
                onClick={handleCancelEdit}
              >
                Cancel Changes
              </button>
            )}
          </div>
        </form>
      ) : (
        // Preview section
        aboutData && (
          <div className="uppercase">
            <h5 className="font-bold text-sm mb-1">Heading</h5>
            <p className="mb-4">{aboutData.heading}</p>
            <h5 className="font-bold text-sm mb-1">Sub Heading</h5>
            <p className="mb-4">{aboutData.subHeading}</p>
            <h5 className="font-bold text-sm mb-1">Quote</h5>
            <p className="mb-4">{aboutData.quote}</p>
            <h5 className="font-bold text-sm mb-1">Hero Image</h5>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                aboutData.image1
              }`}
              alt="Hero Image"
              className="md:w-1/2 mb-4"
            />
            <h5 className="font-bold text-sm mb-1"> About Title</h5>
            <p className="mb-4">{aboutData.title}</p>
            <h5 className="font-bold text-sm mb-1">About Description</h5>
            <p className="mb-4">{aboutData.description}</p>
            <h5 className="font-bold text-sm mb-1">About Image</h5>
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${
                aboutData.image2
              }`}
              alt="About Image"
              className="md:w-1/2 mb-4"
            />
            <h3 className="font-bold text-sm mb-1 mt-4">Pros</h3>
            <ul className="list-disc pl-5 mb-4">
              {aboutData.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
            <h3 className="font-bold text-sm mb-1 mt-4">Cons</h3>
            <ul className="list-disc pl-5 mb-6">
              {aboutData.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>

            <button
              type="button"
              className="text-xs py-3 px-10 text-dark text-sm uppercase hover:text-white hover:bg-dark text-white border-2 border-dark transition duration-200 mr-2"
              onClick={handleEdit}
            >
              Edit About
            </button>
            <button
              type="button"
              className="text-xs py-3 px-10 bg-red-500 text-white text-sm uppercase border-2 border-red-600 hover:bg-red-600 transition duration-200"
              onClick={confirmDelete}
            >
              Delete About
            </button>
          </div>
        )
      )}
    </motion.section>
  );
};

export default AboutManagement;

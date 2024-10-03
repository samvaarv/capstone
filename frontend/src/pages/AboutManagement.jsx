import { useState, useEffect } from "react";
import axios from "axios";
import Input from "../components/Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [formVisible, setFormVisible] = useState(true); // Controls form and preview visibility

  const BACKEND_URL = "http://localhost:8888";

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const response = await axios.get(`/api/admin/about`);
        if (response.data.success) {
          const { subHeading, heading, quote, title, description, image1, image2, pros, cons } = response.data.about;

          setSubHeading(subHeading);
          setHeading(heading);
          setQuote(quote);
          setTitle(title);
          setDescription(description);
          setImage1(image1);
          setImage1Preview(`${BACKEND_URL}/uploads/${image1}`);
          setImage2(image2);
          setImage2Preview(`${BACKEND_URL}/uploads/${image2}`);
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
        const response = await axios.put(`/api/admin/about/${aboutData._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setAboutData(response.data.about);
        toast.success("About page updated successfully");
      } else {
        // Create new about content (POST request)
        const response = await axios.post(`/api/admin/about`, formData, {
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
      await axios.delete(`/api/admin/about/${aboutData._id}`);
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
    <div>
      <ToastContainer />

      {formVisible ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <Input
            type="text"
            placeholder="Sub Heading"
            value={subHeading}
            onChange={(e) => setSubHeading(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            required
          />
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
            <label className="block mb-2">Upload First Image</label>
            <input type="file" onChange={handleImage1Upload} accept="image/*" />
            {image1Preview && (
              <img
                src={image1Preview}
                alt="Preview Image 1"
                className="w-full mt-2"
              />
            )}
          </div>
          <div className="mt-4">
            <label className="block mb-2">Upload Second Image</label>
            <input type="file" onChange={handleImage2Upload} accept="image/*" />
            {image2Preview && (
              <img
                src={image2Preview}
                alt="Preview Image 2"
                className="w-full mt-2"
              />
            )}
          </div>

          <h4 className="font-bold mt-4">Pros</h4>
          {pros.map((pro, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
                placeholder={`Pro ${index + 1}`}
                value={pro}
                onChange={(e) => handleProChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemovePro(index)}
                className="ml-2 bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 bg-green-500 text-white py-1 px-4 rounded"
            onClick={handleAddPro}
          >
            Add Pro
          </button>

          <h4 className="font-bold mt-4">Cons</h4>
          {cons.map((con, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                className="mt-2 p-2 border border-gray-300 rounded w-full"
                placeholder={`Con ${index + 1}`}
                value={con}
                onChange={(e) => handleConChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveCon(index)}
                className="ml-2 bg-red-500 text-white px-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="mt-2 bg-green-500 text-white py-1 px-4 rounded"
            onClick={handleAddCon}
          >
            Add Con
          </button>

          <button type="submit" className="mt-6 bg-blue-500 text-white py-2 px-4 rounded">
            {isEditing ? "Save Changes" : "Add About"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="ml-4 mt-6 bg-gray-500 text-white py-2 px-4 rounded"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </button>
          )}
        </form>
      ) : (
        // Preview section
        aboutData && (
          <div>
            <h2 className="text-2xl font-bold">{aboutData.heading}</h2>
            <h2 className="text-2xl font-bold">{aboutData.subHeading}</h2>
            <p className="italic">{aboutData.quote}</p>
            <h2 className="text-2xl font-bold">{aboutData.title}</h2>
            <p>{aboutData.description}</p>
            <img src={`${BACKEND_URL}/uploads/${aboutData.image1}`} alt="First Image" />
            <img src={`${BACKEND_URL}/uploads/${aboutData.image2}`} alt="Second Image" />
            <h3 className="font-bold mt-4">Pros</h3>
            <ul>
              {aboutData.pros.map((pro, index) => (
                <li key={index}>{pro}</li>
              ))}
            </ul>
            <h3 className="font-bold mt-4">Cons</h3>
            <ul>
              {aboutData.cons.map((con, index) => (
                <li key={index}>{con}</li>
              ))}
            </ul>

            <button
              type="button"
              className="mt-6 bg-yellow-500 text-white py-2 px-4 rounded"
              onClick={handleEdit}
            >
              Edit About
            </button>
            <button
              type="button"
              className="ml-4 mt-6 bg-red-500 text-white py-2 px-4 rounded"
              onClick={confirmDelete}
            >
              Delete About
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AboutManagement;

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads")); // Use the uploads folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  },
});

// Initialize multer with multiple file handling
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB (adjust as needed)
  },
});

export default upload;

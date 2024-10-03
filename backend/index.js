import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";
import { User } from "./models/userModel.js";
import authRoutes from "./routes/authRoute.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8888;
const __dirname = path.resolve();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposedHeaders: [
      "Content-Range",
      "X-Content-Range",
      "Access-Control-Allow-Origin",
    ],
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; script-src 'self';"
  );
  next();
});

app.use(express.json());
app.use(cookieParser());

// Serve static files from the uploads directory
app.use(
  "/uploads",
  express.static(path.join(__dirname, "backend", "public", "uploads"))
);
// app.use(express.static(path.join(__dirname, "public")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploads folder

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Function to check if an admin user exists
const checkAdminExists = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("Admin already exists");
    } else {
      console.log("No admin found. You should create an admin.");
    }
  } catch (error) {
    console.error("Error checking admin existence:", error);
  }
};

// Start server and check if admin exists
app.listen(port, async () => {
  await connectDB();
  await checkAdminExists();
  console.log(`Listening on http://localhost:${port}`);
});

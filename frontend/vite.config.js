import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Get the absolute path to your uploads folder
const uploadsPath = path.resolve(__dirname, "../backend/uploads");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8888",
        changeOrigin: true,
        secure: false,
      },
    },
    fs: {
      allow: [
        path.resolve(__dirname, "../backend/uploads"), // Allow access to the uploads folder
        path.resolve(__dirname, "."), // Allow access to the current directory
      ],
    },
  },
});

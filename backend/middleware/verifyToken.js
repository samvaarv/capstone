import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.userId = decoded.userId;

    // Fetch the user from the database
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - user not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in verifyToken:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

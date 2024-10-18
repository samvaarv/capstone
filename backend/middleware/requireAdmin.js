export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Proceed if the user is an admin
  } else {
    return res
      .status(403)
      .json({ success: false, message: "Access denied - Admins only" });
  }
};

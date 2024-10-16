import Notification from "../models/notificationModel.js";

// Get notifications for the logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.email });
    return res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ success: false, message: "Error fetching notifications." });
  }
};

// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    await Notification.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ success: false, message: "Error marking notification as read." });
  }
};

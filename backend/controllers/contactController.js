import Inquiry from "../models/inquiryModel.js";
import sendgrid from "@sendgrid/mail";
import Notification from "../models/notificationModel.js";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// Send Inquiry
export const sendInquiry = async (req, res) => {
    const { firstName, lastName, email, subject, message } = req.body;
  
    try {
      const newInquiry = new Inquiry({
        firstName,
        lastName,
        email,
        subject,
        message,
      });
      await newInquiry.save();
  
      // Send an email to the admin
      const adminEmailContent = {
        to: process.env.ADMIN_EMAIL,
        from: process.env.FROM_EMAIL,
        replyTo: email,  // Use the user's email as the reply-to address
        subject: `New Inquiry from ${firstName} ${lastName}`,
        text: `Subject: ${subject}\n\nMessage: ${message}`,
        html: `<strong>Subject: ${subject}</strong><p>${message}</p>`,
      };
      await sendgrid.send(adminEmailContent);
  
      // Send a copy to the client
      const clientEmailContent = {
        to: email,
        from: process.env.ADMIN_EMAIL,
        subject: `Copy of your Inquiry: ${subject}`,
        text: `Thank you for reaching out! Here’s a copy of your inquiry:\n\nSubject: ${subject}\n\nMessage: ${message}`,
        html: `<strong>Thank you for reaching out!</strong><p>Here’s a copy of your inquiry:</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong> ${message}</p>`,
      };
      await sendgrid.send(clientEmailContent);
  
      return res.status(200).json({ success: true, message: "Message sent successfully." });
    } catch (error) {
      console.error("Error sending inquiry:", error);
      return res.status(500).json({ success: false, message: "Error sending message." });
    }
  };
  

// Get all inquiries (admin-only)
export const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find();
    return res.status(200).json({ success: true, inquiries });
  } catch (error) {
    console.error("Error fetching inquiries:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching inquiries." });
  }
};

// Reply to an inquiry (admin-only)
export const replyToInquiry = async (req, res) => {
    const { inquiryId } = req.params;
    const { replyMessage } = req.body;
  
    try {
      const inquiry = await Inquiry.findById(inquiryId);
      if (!inquiry) {
        return res.status(404).json({ success: false, message: "Inquiry not found." });
      }
  
      // Send reply email to the client
      const emailContent = {
        to: inquiry.email,
        from: process.env.ADMIN_EMAIL, // Verified email address
        subject: `Reply to your inquiry: ${inquiry.subject}`,
        text: replyMessage,
        html: `<p>${replyMessage}</p>`,
      };
      await sendgrid.send(emailContent);
  
      // Mark inquiry as replied
      inquiry.replied = true;
      await inquiry.save();
  
      // Create a notification for the client
      const notification = new Notification({
        user: inquiry.email,
        message: `You have received a reply to your inquiry. Check your email for more details.`,
      });
      await notification.save();
  
      return res.status(200).json({ success: true, message: "Reply sent and client notified." });
    } catch (error) {
      console.error("Error replying to inquiry:", error);
      return res.status(500).json({ success: false, message: "Error sending reply." });
    }
  };

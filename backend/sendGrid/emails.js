import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplate.js";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email, verificationToken) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  const msg = {
    to: email,
    from: process.env.ADMIN_EMAIL, // Use your SendGrid verified sender email
    subject: "Verify Your Email",
    html: VERIFICATION_EMAIL_TEMPLATE.replace(
      "{verificationCode}",
      verificationToken
    ),
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending verification email: ${error}`);
    throw new Error("Error sending verification email");
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const msg = {
    to: email, // The recipient's email address
    from: process.env.ADMIN_EMAIL, // Use your verified sender email
    templateId: "d-3c2878c5bd0d4d1b94c6c1157e96cb49", // Your SendGrid dynamic template ID
    dynamicTemplateData: {
      name: name, // This will replace the {{name}} placeholder in the template
    },
  };

  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending welcome email: ${error}`);
    throw new Error("Error sending welcome email");
  }
};

export const sendPassswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  const emailTemplate = PASSWORD_RESET_REQUEST_TEMPLATE.replace(
    "{resetURL}",
    resetURL
  );

  const msg = {
    to: email,
    from: process.env.ADMIN_EMAIL,
    subject: "Reset Your Password",
    html: emailTemplate,
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password reset email: ${error}`);
    throw new Error("Error sending password reset email");
  }
};

export const sendResetSuccessfulEmail = async (email) => {
  const msg = {
    to: email,
    from: process.env.ADMIN_EMAIL,
    subject: "Password Reset Successful",
    html: PASSWORD_RESET_SUCCESS_TEMPLATE,
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset success email sent to ${email}`);
  } catch (error) {
    console.error(`Error sending password reset success email: ${error}`);
    throw new Error("Error sending password reset success email");
  }
};

export const sendCancellationEmail = async (message) => {
  try {
    await sgMail.send(message);
    console.log(`Cancellation email sent to ${message.to}`);
  } catch (error) {
    console.error("Error sending cancellation email:", error);
    throw new Error("Error sending email");
  }
};

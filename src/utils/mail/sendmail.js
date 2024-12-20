import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendUserVerificationEmail = (email, verificationToken,verificationLink) => {
  console.log("Email:", email);

  const subject = "Verify Your Account";

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <h1 style="color: #4CAF50;">Verify Your Account</h1>
      <p>Dear User,</p>
      <p>Thank you for signing up! Please verify your account by clicking the link below:</p>
      <p style="margin: 20px 0;">
        <a href="${verificationLink}" style="color: #fff; background-color: #4CAF50; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify My Account</a>
      </p>
      <p>If the button above doesn't work, you can also verify your account using the link below:</p>
      <p><a href="${verificationLink}" style="color: #4CAF50;">${verificationLink}</a></p>
      <br/>
      <p style="color: #777; font-size: 12px;">If you did not sign up for this account, you can safely ignore this email.</p>
    </div>
  `;

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Correct Gmail SMTP host
    port: 587, // Use port 587 for TLS
    secure: false, // Use true for port 465 (SSL)
    auth: {
      user: process.env.NODEMAILER_EMAIL_USER, // Your Gmail address (from .env)
      pass: process.env.NODEMAILER_EMAIL_PASS, // Your Gmail app password (from .env)
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL_USER, // Your Gmail address
    to: email, // Recipient's email address
    subject, // Subject of the email
    html, // HTML content of the email
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error); // Log the error
        return reject(error); // Reject the promise with the error
      } else {
        console.log("Email sent successfully:", info.response); // Log success
        return resolve("Verification Email Sent Successfully"); // Resolve the promise with success message
      }
    });
  });
};

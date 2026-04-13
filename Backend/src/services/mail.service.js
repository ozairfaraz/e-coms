import nodemailer from "nodemailer";
import { config } from "../config/config.js";

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: config.GOOGLE_USER,
    clientId: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    refreshToken: config.GOOGLE_REFRESH_TOKEN,
    // Note: The access token is typically generated dynamically using the refresh token, so it's not hardcoded here. You would implement a function to get the access token when needed.
    // accessToken: "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x",
    // expires: 1484314697598,
  },
});

// Verify the connection configuration
transporter
  .verify()
  .then(() => {
    console.log("Mail transporter is ready to send emails");
  })
  .catch((error) => {
    console.error("Error verifying mail transporter configuration:", error);
  });

// Function to send email
export const sendMailHandler = async ({to, subject, text, html}) => {
  try {
    const mailOptions = {
    from: config.GOOGLE_USER,
    to,
    subject,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent: " + info.messageId);

   return { success: true, info };
  } catch (error) {
    return { success: false, error };
  }
  
};

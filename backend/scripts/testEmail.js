import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Import only after loading environment variables
const { transporter } = await import("../config/mailer.js");

const sendTestEmail = async () => {
  try {

    const info = await transporter.sendMail({
      from: `"Bhawal Mart" <${process.env.EMAIL_USER}>`,
      to: "imtiazfriend20@gmail.com",
      subject: "Your invoice",
      text: "Thank you for your information.",
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

sendTestEmail();
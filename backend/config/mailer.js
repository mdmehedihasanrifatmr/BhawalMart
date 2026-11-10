
import nodemailer from "nodemailer";

export const createTransporter = () => {
  const { EMAIL_USER, EMAIL_APP_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_APP_PASS) {
    throw new Error("Email credentials are missing from environment variables.");
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASS,
    },
  });
};

export const verifyMailer = async () => {
  try {
    console.log("Transporter credentials:", {
      userExists: Boolean(transporter.options.auth?.user),
      passwordExists: Boolean(transporter.options.auth?.pass),
      passwordLength: transporter.options.auth?.pass?.length,
    });

    await transporter.verify();

    console.log("Email Server is ready!");
  } catch (error) {
    console.error("SMTP verification failed:", error);
  }
};
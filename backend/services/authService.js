import { hashPassword, comparePassword } from "../utils/password.js";
// import {
//   validateSignup,
//   validateSignin,
//   validateChangePassword,
// } from "../validators/authValidator.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token.js";

import crypto from "node:crypto";

import { createTransporter } from "../config/mailer.js";


export const registerUser = async (userData) => {
  const { name, email, password } = userData;

  const normalizeEmail = email.trim().toLowerCase();

//   validateSignup({ name, email, password });

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("If registration can be completed, verification instructions will be sent to your email.", 409);
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(verificationToken).digest("hex");

  const emailVerificationExpires = Date.now()+15*60*1000;

  const hashedPassword = await hashPassword(password);


  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    emailVerificationToken:hashedToken,
    emailVerificationExpires
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

  

  try{
    const transporter = createTransporter();
    
    const info = await transporter.sendMail({
        from: `"Bhawal Mart" <${process.env.EMAIL_USER}>`,
        to: normalizeEmail,
        subject: "Verify Your Email Address",
        html: `
          <div>
            <h2>Welcome to Bhawal Mart!</h2>

            <p>Please verify your email address.</p>

            <a href="${verificationUrl}">
              Verify Email
            </a>

            <p>This link expires in 15 minutes.</p>
          </div>
        `,
      });
  }catch(e){
    console.error("Verification email delivery failed:",e);
  }


  return {
    message: "Signup successful",
    userId: user._id,
  };
};

export const loginUser = async ({ email, password }) => {
//   validateSignin({ email, password });

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid Email or Password", 401);
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid Email or Password", 401);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return {
    accessToken,
    refreshToken,
  };
};

export const changePassword = async (userId, currentPassword, newPassword) => {
//   validateChangePassword(currentPassword, newPassword);

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  const isPasswordCorrect = await comparePassword(
    currentPassword,
    user.password,
  );
  if (!isPasswordCorrect) {
    throw new AppError("Incorrect Password", 401);
  }
  if (currentPassword === newPassword) {
    throw new AppError("Password must be different");
  }
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
  return {
    message: "Password changed successfully",
  };
};

export const refreshAccessToken = async (refreshToken) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }
  const user = await User.findById(decoded.sub);

  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }
  const accessToken = generateAccessToken(user);
  return accessToken;
};

export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    createdAt: user.createdAt,
  };
};


export const verifyUserEmail = async(token)=>{
  if(!token){
     return res.status(400).json({success:false,message:"Verification token is required."});
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken:hashedToken,
      emailVerificationExpires:{$gt:Date.now()},
      isEmailVerified:false,
    })

    if(!user){
      return res.status(400).json({success:false,message:"Invalid or expired verification link."});
    }

    user.isEmailVerified=true,
    user.emailVerificationExpires=null;
    user.emailVerificationToken=null;

    await user.save();
    return {user};
}
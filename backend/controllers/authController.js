import User from "../models/User.js";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  getCurrentUser,
  changePassword,
  verifyUserEmail,
} from "../services/authService.js";
import AppError from "../utils/AppError.js";

export const register = async (req, res) => {
  const result = await registerUser(req.body);

  res.status(201).json({
    success: true,
    message: result.message,
    userId: result.userId,
  });
};

export const login = async (req, res) => {
  const { accessToken, refreshToken } = await loginUser(req.body);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Signin successful",
  });
};

export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const me = async (req, res) => {
  const user = await getCurrentUser(req.user.sub);

  res.status(200).json({
    success: true,
    user,
  });
};

export const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await changePassword(
    req.user.sub,
    currentPassword,
    newPassword,
  );
  res.status(200).json({
    success: true,
    message: result.message,
  });
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token required", 401);
  }
  const accessToken = await refreshAccessToken(refreshToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Access token refreshed.",
  });
};



export const verifyEmail = async(req,res,next)=>{
  try{
    const {token} =req.body;

    const user = await verifyUserEmail(token);

    if(!user){
      res.status(400).json({success:false,message:"Invalid token or expired verification link."});
    }

    res.status(200).json({success:true,message:"Email verification successful. You can now sign in."});

  }catch(e){
    next(e);
  }
}
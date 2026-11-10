import { verifyAccessToken } from "../utils/token.js";
import AppError from "../utils/AppError.js";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new AppError("Authentication required", 401);
  }

  try {
    const decoded = verifyAccessToken(token);

    req.user = decoded;

    next();
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }
};

export default authMiddleware;
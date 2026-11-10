import express from "express";
import {
  register,
  login,
  refresh,
  logout,
  me,
  changeUserPassword
} from "../controllers/authController.js"


// import { ROLES } from "../constants/roles.js";
import authMiddleware from "../middlewares/authMiddleware.js";
// import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);
router.post("/change-password", authMiddleware, changeUserPassword);
router.get("/me", authMiddleware, me);

// router.get(
//   "/admin",
//   authMiddleware,
//   roleMiddleware(ROLES.ADMIN),
//   (req, res) => {
//     res.status(200).json({
//       success: true,
//       message: "Welcome Admin",
//     });
//   },
// );
export default router;

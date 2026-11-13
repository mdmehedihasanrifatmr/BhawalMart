import Router from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminOnly from "../middlewares/adminOnly.js";
import { createProduct } from "../controllers/productController.js";

const router = Router();


router.get("/",);
router.get("/:id",);
router.post("/create",authMiddleware,adminOnly,createProduct);



export default router;
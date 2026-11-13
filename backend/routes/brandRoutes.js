import Router from "express";
import { createBrandController, getBrandByIdController, getBrandsController } from "../controllers/brandController.js";

const router = Router();

router.get("/",getBrandsController);
router.get("/:brandId",getBrandByIdController);
router.post("/",createBrandController);

export default router;
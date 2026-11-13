import Router from "express";

import { createCategoryController, deleteCategoryController, getCategoryByIdController, getCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = Router();

router.get("/",getCategoryController);
router.get("/:categoryId",getCategoryByIdController);
router.post("/",createCategoryController);
router.put("/:categoryId",updateCategoryController);
router.delete("/:categoryId",deleteCategoryController);

export default router;
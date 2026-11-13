import { createCategory,getCategory,getCategoryById,updateCategory,deleteCategory } from "../services/categoryService.js";

export const createCategoryController = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryController = async (req, res, next) => {
  try {
    const categories = await getCategory();

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoryByIdController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await getCategoryById(categoryId);

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const updatedCategory = await updateCategory(
      categoryId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const result = await deleteCategory(categoryId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
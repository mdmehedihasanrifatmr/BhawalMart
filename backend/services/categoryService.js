import Category from "../models/Category.js";
import Product from "../models/Product.js";

const validateParentCategory = async (categoryId, parentCategoryId) => {
  let currentParentId = parentCategoryId;

  while (currentParentId) {
    if (categoryId && currentParentId.toString() === categoryId.toString()) {
      throw new Error("Circular category relationship is not allowed");
    }

    const parent =
      await Category.findById(currentParentId).select("parentCategory");

    if (!parent) {
      throw new Error("Parent category not found");
    }

    currentParentId = parent.parentCategory;
  }
};

export const createCategory = async (categoryData) => {
  const { name, slug, description, imageUrl, parentCategory } = categoryData;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new Error("Category name already exists");
  }

  const existingSlug = await Category.findOne({ slug });

  if (existingSlug) {
    throw new Error("Category slug already exists");
  }

  if (parentCategory) {
    await validateParentCategory(null, parentCategory);
  }

  const category = await Category.create({
    name,
    slug,
    description,
    imageUrl,
    parentCategory: parentCategory || null,
  });

  return category;
};

export const getCategory = async () => {
  const categories = await Category.find()
    .populate("parentCategory", "name slug")
    .sort({ sortOrder: 1, createdAt: -1 });

  return categories;
};

export const getCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId).populate(
    "parentCategory",
    "name slug",
  );

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategory = async (categoryId, updateData) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const { name, slug, description, imageUrl, parentCategory } = updateData;

  if (name !== undefined && name !== category.name) {
    const existingCategory = await Category.findOne({
      name,
      _id: { $ne: categoryId },
    });

    if (existingCategory) {
      throw new Error("Category name already exists");
    }
  }

  if (slug !== undefined && slug !== category.slug) {
    const existingSlug = await Category.findOne({
      slug,
      _id: { $ne: categoryId },
    });

    if (existingSlug) {
      throw new Error("Category slug already exists");
    }
  }

  if (parentCategory !== undefined) {
    if (parentCategory === null) {
      category.parentCategory = null;
    } else {
      await validateParentCategory(categoryId, parentCategory);

      category.parentCategory = parentCategory;
    }
  }

  if (name !== undefined) category.name = name;
  if (slug !== undefined) category.slug = slug;
  if (description !== undefined) category.description = description;
  if (imageUrl !== undefined) category.imageUrl = imageUrl;

  await category.save();

  return category;
};

export const deleteCategory = async (categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new Error("Category not found");
  }

  const hasChildren = await Category.exists({
    parentCategory: categoryId,
  });

  if (hasChildren) {
    throw new Error("Cannot delete category because it has child categories");
  }

  const hasProducts = await Product.exists({
    category: categoryId,
  });

  if (hasProducts) {
    throw new Error(
      "Cannot delete category because products are associated with it",
    );
  }

  await category.deleteOne();

  return {
    message: "Category deleted successfully",
  };
};

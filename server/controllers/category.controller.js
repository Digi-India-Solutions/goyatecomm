import { Category } from "../models/category.model.js";
import { MainCategory } from "../models/mainCategory.model.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.util.js";
import { SubCategory } from "../models/subCategory.model.js";

const createCategory = async (req, res) => {
  try {
    const { SubCategoryName, Parent_name } = req.body;
    if (!SubCategoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const localPath = req.files?.["image"]?.[0]?.filename;
    if (!localPath) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newCategory = await Category.create({
      SubCategoryName,
      categoryImage: localPath,
      Parent_name,
    });

    return res
      .status(201)
      .json({ message: "Category created", category: newCategory });
  } catch (error) {
    console.error("Create Category Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in create category" });
  }
};

const multipleCategory = async (req, res) => {
  try {
    const { categories } = req.body || {};
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Categories are required" });
    }
    const AllCategories = await Promise.all(
      categories.map(async (category) => {
        const mainCategory = await MainCategory.findOne({
          Parent_name: category.Parent_name,
        });
        if (mainCategory) {
          category.Parent_name = mainCategory._id;
        }
        return category;
      })
    );
    const result = await Category.insertMany(AllCategories);
    return res.status(201).json({
      message: "Multiple categories created successfully",
      categories: result,
    });
  } catch (error) {
    console.log("Multiple Category Error:", error);
    return res.status(500).json({
      message: "Internal Server Error in multiple category creation",
    });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("Parent_name");
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Get All Categories Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in get all categories" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json(category);
  } catch (error) {
    console.error("Get Category by ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { SubCategoryName, mainCategory } = req.body;
  
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    if (req.files?.["image"]?.[0]?.path) {
      const imageUrl = req.files?.["image"]?.[0]?.filename;
      if (imageUrl) category.categoryImage = imageUrl;
    } else {
      category.categoryImage = category.categoryImage;
    }
    if (mainCategory) {
      const isMainCategoryExist = await MainCategory.findById(mainCategory);
      if (isMainCategoryExist) {
        category.Parent_name = isMainCategoryExist._id;
      }
    }
   
    category.SubCategoryName = SubCategoryName ?? category.SubCategoryName;
    await category.save();
    return res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    console.error("Update Category Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in delete category" });
  }
};

const getCategoryByMainCategory = async (req, res) => {
  try {
    const category = await Category.find({
      Parent_name: req.params.id,
    }).populate("Parent_name");
    return res.status(200).json(category);
  } catch (error) {
    console.error("Get Category by ID Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const addCategoryAndSubcategory = async (req, res) => {
  try {
    const { categories } = req.body || {};
    if (categories.length === 0) {
      return res.status(400).json({ error: "Categories are required" });
    }
    const mainCategories = await MainCategory.find();

    const mainCategoryMap = new Map();
    mainCategories.forEach((main) => {
      mainCategoryMap.set(String(main.Parent_id), main._id.toString());
    });

    const savedCategoryMap = new Map();

    for (const category of categories) {
      const { Categories_id, Categories_name, Parent_id } = category;

      if (mainCategoryMap.has(String(Parent_id))) {
        const newCategory = new Category({
          SubCategoryName: Categories_name,
          Parent_name: mainCategoryMap.get(String(Parent_id)),
          Sub_CATEGORIES_ID: Categories_id,
        });
        const savedCategory = await newCategory.save();
        savedCategoryMap.set(String(Categories_id), savedCategory);
      }
    }

    for (const category of categories) {
      const { Categories_id, Categories_name, Parent_id } = category;

      if (savedCategoryMap.has(String(Parent_id))) {
        const parentCategory = savedCategoryMap.get(String(Parent_id));
        const subCategory = new SubCategory({
          Sub_CATEGORIES_ID: Categories_id,
          subCategoryName: Categories_name,
          category: parentCategory._id,
        });
        await subCategory.save();
      }
    }

    return res.status(200).json({
      message: "Categories and subcategories processed successfully.",
    });
  } catch (error) {
    console.log("addCategoryAndSubcategory error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createCategory,
  multipleCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryByMainCategory,
  addCategoryAndSubcategory,
};

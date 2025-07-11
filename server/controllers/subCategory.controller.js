import { SubCategory } from "../models/subCategory.model.js";
import { Category } from "../models/category.model.js";
import { deleteLocalImage } from "../utils/image.util.js";

const createSubCategory = async (req, res) => {
  try {
    const { subCategoryName, category } = req.body;

    if (!subCategoryName || !category) {
      return res
        .status(400)
        .json({ message: "Name and category are required" });
    }

    const isCategoryExist = await Category.findById(category);
    if (!isCategoryExist) {
      return res.status(400).json({ message: "Category does not exist" });
    }
    let imagePaths;
    const imageFiles = req.files?.["images"] || [];
    if (imageFiles.length > 0) {
      imagePaths = imageFiles.map((file) => file.filename);
    }

    const newSubCategory = await SubCategory.create({
      subCategoryName,
      category,
      subCategoryImage: imagePaths,
    });

    return res
      .status(201)
      .json({ message: "SubCategory created", subCategory: newSubCategory });
  } catch (err) {
    console.error("Create SubCategory Error:", err);
    res.status(500).json({ message: "Server Error in create subcategory" });
  }
};

const getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("category");
    return res.status(200).json(subCategories);
  } catch (err) {
    console.error("Get SubCategories Error:", err);
    res.status(500).json({ message: "Server Error in get all subcategories" });
  }
};

const getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate(
      "category"
    );
    if (!subCategory) return res.status(404).json({ message: "Not found" });
    return res.status(200).json(subCategory);
  } catch (err) {
    res.status(500).json({ message: "Server Error in get subcategory" });
  }
};

const updateSubCategory = async (req, res) => {
  try {
    const { subCategoryName, category } = req.body;
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory)
      return res.status(404).json({ message: "SubCategory not found" });

    const newImages = req.files?.["images"]?.map((file) => file.filename) || [];

    if (newImages.length > 0) {
      for (const img of subCategory.subCategoryImage) {
        await deleteLocalImage(img);
      }
      subCategory.subCategoryImage = newImages;
    }

    if (subCategoryName) subCategory.subCategoryName = subCategoryName;
    if (category) subCategory.category = category;

    await subCategory.save();
    return res
      .status(200)
      .json({ message: "Updated successfully", subCategory });
  } catch (err) {
    console.error("Update SubCategory Error:", err);
    res.status(500).json({ message: "Server Error in update subcategory" });
  }
};

const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) return res.status(404).json({ message: "Not found" });

    for (const img of subCategory.subCategoryImage) {
    await deleteLocalImage(img);  
  }

    await subCategory.deleteOne();
    return res.status(200).json({ message: "SubCategory deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server Error in delete subcategory" });
  }
};

export {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};

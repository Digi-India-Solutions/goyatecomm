import { Level } from "../models/level.model.js";
import { Category } from "../models/category.model.js";

 const createLevel = async (req, res) => {
  try {
    const { category, level, isActive } = req.body;

    if (!category) {
      return res.status(400).json({ message: "Main category is required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Main category does not exist" });
    }

    const levelImage = req.file?.filename;
    if (!levelImage) {
      return res.status(400).json({ message: "Level image is required" });
    }

    const newLevel = await Level.create({
      category,
      levelImage,
      level: Number(level) ?? 0,
      isActive:isActive==="true" ?? false,
    });

   return res.status(201).json({ message: "Level created", level: newLevel });
  } catch (error) {
    console.error("Create Level Error:", error);
    res.status(500).json({ message: "Server error in create level" });
  }
};

 const getAllLevels = async (req, res) => {
  try {
    const levels = await Level.find().populate("category");
    return res.status(200).json(levels);
  } catch (error) {
    console.error("Get All Levels Error:", error);
    res.status(500).json({ message: "Server error in get all levels" });
  }
};

 const getSingleLevel = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id).populate("category");
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }
   return res.status(200).json(level);
  } catch (error) {
    console.error("Get Single Level Error:", error);
    res.status(500).json({ message: "Server error in get single level" });
  }
};

 const updateLevel = async (req, res) => {
  try {
    const { category, level, isActive } = req.body;
    const levelId = req.params.id;

    const levelDoc = await Level.findById(levelId);
    if (!levelDoc) {
      return res.status(404).json({ message: "Level not found" });
    }

    const updatedImage = req.file?.filename;
    if (updatedImage) levelDoc.levelImage = updatedImage;
    if (category) levelDoc.category = category;
    if (level !== undefined) levelDoc.level = Number(level);
    if (isActive !== undefined) levelDoc.isActive = isActive==="true";

    await levelDoc.save();
    res.status(200).json({ message: "Level updated", level: levelDoc });
  } catch (error) {
    console.error("Update Level Error:", error);
    res.status(500).json({ message: "Server error in update level" });
  }
};

 const deleteLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndDelete(req.params.id);
    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }
    res.status(200).json({ message: "Level deleted" });
  } catch (error) {
    console.error("Delete Level Error:", error);
  return  res.status(500).json({ message: "Server error in delete level" });
  }
};

export {
  createLevel,
  getAllLevels,
  getSingleLevel,
  updateLevel,
  deleteLevel,
};
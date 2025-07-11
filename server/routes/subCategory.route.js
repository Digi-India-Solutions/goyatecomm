import express from "express";
import {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subCategory.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHadler.middleware.js";

const router = express.Router();

router.post(
  "/create-sub-category",
  verifyAdmin,
  upload.fields([{ name: "images", maxCount: 5 }]),
  multerErrorHandler,
  createSubCategory
);

router.get("/get-all-sub-categories", getAllSubCategories);

router.get("/get-single-sub-category/:id", getSubCategoryById);
router.put(
  "/update-sub-category/:id",
  verifyAdmin,
  upload.fields([{ name: "images", maxCount: 5 }]),
  multerErrorHandler,
  updateSubCategory
);
router.delete("/delete-sub-category/:id", verifyAdmin, deleteSubCategory);

export default router;

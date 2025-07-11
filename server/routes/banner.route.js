import express from "express";
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from "../controllers/banner.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import {multerErrorHandler} from "../middlewares/multerErrorHadler.middleware.js";

const router = express.Router();

router.post("/create-banner", verifyAdmin, upload.single("image"),multerErrorHandler, createBanner);
router.put("/update-banner/:id", verifyAdmin, upload.single("image"),multerErrorHandler, updateBanner);
router.get("/get-all-banners", getAllBanners);
router.get("/get-banner/:id", getBannerById);
router.delete("/delete-banner/:id", verifyAdmin, deleteBanner);

export default router;

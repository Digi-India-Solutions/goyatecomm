import express from "express";
import {
  createLevel,
  getAllLevels,
  getSingleLevel,
  updateLevel,
  deleteLevel,
} from "../controllers/level.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHadler.middleware.js";

const router = express.Router();

router.post(
  "/create-level",
  verifyAdmin,
  upload.single("levelImage"),
  multerErrorHandler,
  createLevel
);

router.get("/get-all-levels", getAllLevels);
router.get("/get-single-level/:id", getSingleLevel);

router.put(
  "/update-level/:id",
  verifyAdmin,
  upload.single("levelImage"),
  multerErrorHandler,
  updateLevel
);

router.delete("/delete-level/:id", verifyAdmin, deleteLevel);

export default router;

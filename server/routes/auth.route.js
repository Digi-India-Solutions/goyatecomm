import { Router } from "express";
import { adminLogin, ForgotPassword, login, ResetPassword, signUp, updateProfile, GetSingleUser, GetAllUsers, logout, verifyLoggedIn, verifyAdminLoggedIn, createMultipleUsers } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";
import { multerErrorHandler } from "../middlewares/multerErrorHadler.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/sign-up", signUp);
router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.get("/get-single-user",verifyToken,GetSingleUser)
router.post("/forgot-password",ForgotPassword)
router.post("/reset-password/:id/:token",ResetPassword)
router.get("/verify-user",verifyToken,verifyLoggedIn)
router.put("/update-profile",verifyToken,upload.single("image"),multerErrorHandler,updateProfile)
// router.post("/create-multiple-users", verifyAdmin,createMultipleUsers);
//admin route
router.get("/get-all-users",verifyAdmin,GetAllUsers)
router.post("/admin-login", adminLogin);
router.get("/admin/verify-admin",verifyToken,verifyAdminLoggedIn)
export default router;

import express from "express";
import { createCoupon, getAllCoupons, updateCoupon, deleteCoupon,getSingleCoupon } from "../controllers/coupon.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = express.Router();

router.post("/create-coupon",verifyAdmin, createCoupon); 
router.get("/get-all-coupons", getAllCoupons); 
router.get("/get-coupon/:id", getSingleCoupon);
router.put("/update-coupon/:id",verifyAdmin, updateCoupon);
router.delete("/delete-coupon/:id",verifyAdmin, deleteCoupon);

export default router;
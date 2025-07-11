import {Coupon} from "../models/coupon.model.js";

const createCoupon = async (req, res) => {
  try {
    const { couponCode, title, discount, minAmount, maxAmount, isActive } =
      req.body;
    if (
      !couponCode ||
      !title ||
      !discount ||
      !minAmount ||
      !maxAmount
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newCoupon = new Coupon({
      couponCode,
      title,
      discount,
      minAmount,
      maxAmount,
      isActive,
    });

    const savedCoupon = await newCoupon.save();
    res
      .status(201)
      .json({ message: "Coupon created successfully", data: savedCoupon });
  } catch (error) {
    console.error("create coupon error", error);
    res
      .status(500)
      .json({ message: "Failed to create coupon", error: error.message });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res
      .status(200)
      .json({ message: "Coupons retrieved successfully", data: coupons });
  } catch (error) {
    console.error("get all coupons error", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve coupons", error: error.message });
  }
};

const updateCoupon = async (req, res) => {
  try {

    const { id } = req.params;
    const { couponCode, title, discount, minAmount, maxAmount, isActive } =
      req.body || {};
    const coupon = await Coupon.findById(id);
    coupon.couponCode = couponCode ?? coupon.couponCode;
    coupon.title = title ?? coupon.title;
    coupon.discount = discount ?? coupon.discount;
    coupon.minAmount = minAmount ?? coupon.minAmount;
    coupon.maxAmount = maxAmount ?? coupon.maxAmount;
    coupon.isActive = isActive ?? coupon.isActive;

    const updatedCoupon = await coupon.save();
    if (!updatedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res
      .status(200)
      .json({ message: "Coupon updated successfully", data: updatedCoupon });
  } catch (error) {
    console.error("update coupon error", error);
    res
      .status(500)
      .json({ message: "Failed to update coupon", error: error.message });
  }
};

const deleteCoupon = async (req, res) => {
  try {
   
    const { id } = req.params;

    const deletedCoupon = await Coupon.findByIdAndDelete(id);
    if (!deletedCoupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    res
      .status(200)
      .json({ message: "Coupon deleted successfully", data: deletedCoupon });
  } catch (error) {
    console.error("delete coupon error", error);
    res
      .status(500)
      .json({ message: "Failed to delete coupon", error: error.message });
  }
};

const getSingleCoupon = async (req, res) => {
  try {
    const coupon = await Coupon .findById(req.params.id)
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    return res.status(200).json({ message: "Coupon found", data: coupon });
  } catch (error) {
    console.log("get single coupon error", error);
    return res.status(500).json({ message: "get single coupon server error" });
  }
}
export { createCoupon, getAllCoupons, updateCoupon, deleteCoupon,getSingleCoupon };

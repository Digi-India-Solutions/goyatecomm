import mongoose from "mongoose";

const couponSchema=new mongoose.Schema({
    couponCode: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    minAmount: {
        type: Number,
        required: true,
    },
    maxAmount: {
        type: Number,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
})

export const Coupon = mongoose.model("Coupon", couponSchema);
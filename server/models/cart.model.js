import mongoose from "mongoose";

export const itemsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [itemsSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
});

export const Cart = mongoose.model("Cart", cartSchema);
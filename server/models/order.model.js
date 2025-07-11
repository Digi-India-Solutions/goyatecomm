import mongoose from "mongoose";
import { itemsSchema } from "./cart.model.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    userDetails: {
      name: String,
      upiId: String,
      date: String,
    },
    orderUniqueId: {
      type: String,
      required: true,
    },
    shippingCost: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: null,
    },
    couponDiscount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["Pending", "Paid", "Failed"],
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["COD", "Online"],
    },
    paymentInfo: {
      orderId: {
        type: String,
      },
      transactionId: {
        type: String,
      },
      paymentId: {
        type: String,
      },
      razorpaySignature: {
        type: String,
      },
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Shipped", "Delivered", "Cancelled", "Confirmed"],
      default: "Placed",
    },
    deliveredAt: {
      type: Date,
    },
    shippedAt: {
      type: Date,
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    items: [itemsSchema],
    UTRId: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      firstName: {
        type: String,
        // required: true,
      },
      lastName: {
        type: String,
        // required: true,
      },
      email: {
        type: String,
        // required: true,
      },
      address: {
        type: String,
        // required: true,
      },
      city: {
        type: String,
        // required: true,
      },
      state: {
        type: String,
        // required: true,
      },
      zipCode: {
        type: String,
        // required: true,
      },
      country: {
        type: String,
        // required: true,
      },
      phone: {
        type: String,
        // required: true,
      },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);

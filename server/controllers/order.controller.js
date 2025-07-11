import Razorpay from "razorpay";
import { Cart } from "../models/cart.model.js";
import ShortUniqueId from "short-unique-id";
import { Coupon } from "../models/coupon.model.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const userId = req?.user?._id;
    const {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      phone,
      zipCode,
      country,
      couponCode,
      paymentMethod,
      UTRId
    } = req.body || {};
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "you are not logged in" });
    }
    const cart = await Cart.findOne({ user: userId });
    console.log("cart", cart.items);

    if (!cart) {
      return res.status(400).json({ message: "Cart not found" });
    }
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ message: "Cart is empty" });
    }

    let shippingCost = 20;
    let totalAmount = cart.totalAmount;
    if (totalAmount > 500) {
      shippingCost = 0;
    }
    const uid = new ShortUniqueId({ length: 6, dictionary: "alphanum_upper" });
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const now = new Date();
    const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "");
    const orderId = `ORD-${datePart}${timePart}-${uid.rnd()}`;
    let discount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ couponCode, isActive: true });
      if (coupon) {
        if (coupon.maxAmount < totalAmount) {
          return res.status(400).json({
            message:
              "Coupon is not valid, TotalAmount is greater than max amount ",
          });
        }
        if (coupon.minAmount > totalAmount) {
          return res.status(400).json({
            message:
              "Coupon is not valid, TotalAmount is less than min amount ",
          });
        }
        if (coupon.discount > 100) {
          discount = totalAmount - discount;
        } else {
          discount = (totalAmount * coupon.discount) / 100;
          totalAmount -= discount;
        }
      }
    }
    totalAmount += shippingCost;
    let razorpayOrder = null;
    // if (paymentMethod === "Online") {
    //   try {
    //     razorpayOrder = await razorpay.orders.create({
    //       amount: Math.round(totalAmount * 100),
    //       currency: "INR",
    //       receipt: orderId,
    //       notes: {
    //         userId: userId.toString(),
    //         couponCode: couponCode || "",
    //       },
    //     });
    //   } catch (error) {
    //     console.error("Error in razorpay order:", error);
    //     return res.status(500).json({
    //       message:
    //         error?.error?.description ||
    //         "Internal server error in razorpay order",
    //     });
    //   }
    // }

    await Order.create({
      user: userId,
      orderUniqueId: orderId,
      totalAmount: totalAmount * 100,
      shippingCost,
      couponCode: couponCode || null,
      couponDiscount: discount,
      paymentStatus: "Pending",
      orderStatus: "Placed",
      paymentMethod,
      totalAmount,
      items: cart.items,
      UTRId,
      shippingAddress: {
        firstName,
        lastName,
        email,
        address,
        city,
        state,
        phone,
        zipCode,
        country,
      },
      paymentInfo: razorpayOrder
        ? {
            orderId: razorpayOrder?.id,
          }
        : {},
    });
   
    if (paymentMethod === "COD" || paymentMethod === "Online") {
      const cart = await Cart.findOne({ user: req?.user?._id });

      for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          if (product.stock < item.quantity) {
            return res.status(400).json({ message: "Quantity exceeds stock" });
          }
          product.stock -= item.quantity;
          await product.save();
        }
      }

      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    return res.status(200).json({ message: "Order created successfully" });
  } catch (error) {
    console.log("create order error", error);
    return res.status(500).json({ message: "create order server error" });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body || {};
  const sign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (sign === razorpay_signature) {
    await Checkout.findOneAndUpdate(
      { "paymentInfo.orderId": razorpay_order_id },
      {
        $set: {
          paymentStatus: "Paid",
          "paymentInfo.paymentId": razorpay_payment_id,
          "paymentInfo.razorpaySignature": razorpay_signature,
        },
      },
      { new: true }
    );
    const cart = await Cart.findOne({ userId: req?.user?._id });
    cart.items.length > 0 &&
      cart.items.forEach(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          product.stock -= item.quantity;
          await product.save();
        }
      });
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    return res.status(200).json({ success: true, message: "Payment verified" });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req?.user?._id }).populate(
      "items.productId"
    );
    return res.status(200).json({ orders });
  } catch (error) {
    console.log("get all orders error", error);
    return res.status(500).json({ message: "get all orders server error" });
  }
};

const GetOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items.productId")
      .populate({ path: "user", select: "-password" });
    return res.status(200).json({ message: "Order found", order });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const UpdateCheckout = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body || {};
    const checkout = await Order.findById(id);
    if (orderStatus === "Shipped") {
      checkout.shippedAt = Date.now();
    }
    if (orderStatus === "Delivered") {
      checkout.deliveredAt = Date.now();
    }
    checkout.paymentStatus = paymentStatus ?? checkout.paymentStatus;
    checkout.orderStatus = orderStatus ?? checkout.orderStatus;
    await checkout.save();

    return res.status(200).json({ message: "Checkout updated", checkout });
  } catch (error) {
    console.log("update checkout error", error);

    return res.status(500).json({ message: "Internal server error", error });
  }
};

const DeleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export {
  createOrder,
  verifyPayment,
  getAllOrders,
  GetOrderById,
  UpdateCheckout,
  DeleteOrder,
};

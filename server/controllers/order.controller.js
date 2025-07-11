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
      UTRId,
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

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find().populate(
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

// function generateProductDetails(input, products) {
//   const cleaned = input.replace(/[₹Rs,\s]/g, "").trim();
//   const totalPrice = Number(cleaned);

//   if (isNaN(totalPrice)) {
//     console.log("❌ Invalid amount:", input);
//     return [];
//   }

//   function seededRandom(seed) {
//     let x = Math.sin(seed) * 10000;
//     return x - Math.floor(x);
//   }

//   const maxProductCount = 4;
//   const productCount = Math.floor(Math.random() * maxProductCount) + 1;

//   const selectedProducts = [];
//   const usedIndexes = new Set();
//   const seedBase = totalPrice;

//   let attempts = 0;
//   let remaining = totalPrice;

//   // Logging for demo
//   console.log("🔢 Total Price:", totalPrice);
//   console.log("🛒 Target Product Count:", productCount);

//   while (selectedProducts.length < productCount && attempts < 20 && remaining > 0) {
//     const seed = seedBase * (attempts + 1);
//     const index = Math.floor(seededRandom(seed) * products.length);

//     if (usedIndexes.has(index)) {
//       attempts++;
//       continue;
//     }

//     const product = products[index];
//     usedIndexes.add(index);

//     const maxQty = Math.floor(remaining / product.finalPrice);
//     if (maxQty <= 0) {
//       attempts++;
//       continue;
//     }

//     const quantity =
//       selectedProducts.length === productCount - 1
//         ? Math.round(remaining / product.finalPrice)
//         : Math.max(1, Math.floor(seededRandom(seed + 1) * Math.min(3, maxQty)));

//     const itemTotal = quantity * product.finalPrice;

//     if (itemTotal > remaining) {
//       attempts++;
//       continue;
//     }

//     selectedProducts.push({
//       productId: product._id,
//       title: product.title,
//       price: product.finalPrice,
//       quantity,
//       itemTotal,
//     });

//     console.log(
//       `✅ Selected: ${product.title} | ₹${product.finalPrice} × ${quantity} = ₹${itemTotal}`
//     );

//     remaining -= itemTotal;
//     attempts++;
//   }

//   // If still amount left, try to adjust last product
//   if (remaining > 0 && selectedProducts.length > 0) {
//     const last = selectedProducts[selectedProducts.length - 1];
//     const product = products.find((p) => p._id.toString() === last.productId.toString());

//     const extraQty = Math.floor(remaining / product.finalPrice);
//     const extraAmount = extraQty * product.finalPrice;

//     if (extraQty > 0) {
//       last.quantity += extraQty;
//       last.itemTotal += extraAmount;
//       remaining -= extraAmount;

//       console.log(
//         `🛠 Adjusted last product (${product.title}): +${extraQty} units → ₹${last.itemTotal}`
//       );
//     }
//   }

//   // 🚚 Add shipping if total is less than ₹500
//   const orderSubtotal = selectedProducts.reduce((acc, p) => acc + p.itemTotal, 0);
//   if (orderSubtotal < 500) {
//     selectedProducts.push({
//       productId: null,
//       title: "Shipping Charges",
//       price: 50,
//       quantity: 1,
//       itemTotal: 50,
//     });
//     console.log("🚚 Added shipping: ₹50");
//   }

//   const finalTotal = selectedProducts.reduce((acc, p) => acc + p.itemTotal, 0);
//   console.log("🧾 Final Order Total:", finalTotal);
//   console.log("------------------------------------------");

//   // Return simplified object (remove title/price/itemTotal in production)
//   return selectedProducts.map(({ productId, quantity }) => ({
//     productId,
//     quantity,
//   }));
// }

// const uploadOrders = async (req, res) => {
//   try {
//     const { orders } = req.body || {};
//     if (!Array.isArray(orders) || orders.length === 0) {
//       return res.status(400).json({ message: "Invalid order data" });
//     }

//     const products = await Product.find({}, "_id title finalPrice");

//     const InstertingOrders = orders.map((order) => {
//       const productDetails = generateProductDetails(order.Amount, products);
//       const cleaned = order.Amount.replace(/[₹Rs,\s]/g, "").trim();
//       const totalAmount = Number(cleaned);
//       const parts = order.Description.split("/");
//       const name = parts[2];
//       const upiId = parts[1];
//       const date = new Date(order.date).toISOString().slice(0, 10);
//         const uid = new ShortUniqueId({ length: 6, dictionary: "alphanum_upper" });
//     const datePart = date.replace(/-/g, "");
//     const now = new Date();
//     const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "");
//     const orderId = `ORD-${datePart}${timePart}-${uid.rnd()}`;
//       return {
//         items: productDetails,
//         totalAmount,
//         userDetails: { date, name, upiId },
//         orderUniqueId: orderId,
//         shippingCost: totalAmount > 500 ? 0 : 20,
//         paymentStatus: "Paid",
//         paymentMethod: "Online",
//         orderStatus: "Delivered",

//       };
//     });

//     console.log("InstertingOrders", InstertingOrders);
    
//     // const result = await Order.insertMany(InstertingOrders);

//     return res.status(200).json({
//       message: "Orders generated successfully",
//       count: InstertingOrders.length,
//       result,
//     });
//   } catch (error) {
//     console.log("generateOrders", error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// };


function generateProductDetails(input, products) {
  const cleaned = input.replace(/[₹Rs,\s]/g, "").trim();
  const totalPrice = Number(cleaned);

  if (isNaN(totalPrice)) {
    console.log("❌ Invalid amount:", input);
    return { items: [], total: 0 };
  }

  function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const sortedProducts = [...products].sort((a, b) => b.finalPrice - a.finalPrice);
  const maxProductCount = 4;
  const productCount = Math.floor(Math.random() * maxProductCount) + 1;

  const selectedProducts = [];
  const usedIndexes = new Set();
  let attempts = 0;
  let remaining = totalPrice;

  console.log("🔢 Target Price:", totalPrice);
  console.log("🎯 Attempting with", productCount, "products");

  while (selectedProducts.length < productCount && attempts < 20 && remaining > 0) {
    const seed = totalPrice * (attempts + 1);
    const index = Math.floor(seededRandom(seed) * sortedProducts.length);

    if (usedIndexes.has(index)) {
      attempts++;
      continue;
    }

    const product = sortedProducts[index];
    usedIndexes.add(index);

    const maxQty = Math.floor(remaining / product.finalPrice);
    if (maxQty <= 0) {
      attempts++;
      continue;
    }

    const quantity =
      selectedProducts.length === productCount - 1
        ? Math.floor(remaining / product.finalPrice)
        : Math.max(1, Math.floor(seededRandom(seed + 1) * Math.min(3, maxQty)));

    const itemTotal = quantity * product.finalPrice;

    if (itemTotal > remaining) {
      attempts++;
      continue;
    }

    selectedProducts.push({
      productId: product._id,
      title: product.title,
      unitPrice: product.finalPrice,
      quantity,
      itemTotal,
    });

    console.log(`✅ ${product.title} — ₹${product.finalPrice} × ${quantity} = ₹${itemTotal}`);
    remaining -= itemTotal;
    attempts++;
  }

  // Try adjusting last product to match total
  if (remaining > 0 && selectedProducts.length > 0) {
    const last = selectedProducts[selectedProducts.length - 1];
    const extraQty = Math.floor(remaining / last.unitPrice);
    const extraTotal = extraQty * last.unitPrice;

    if (extraQty > 0) {
      last.quantity += extraQty;
      last.itemTotal += extraTotal;
      remaining -= extraTotal;

      console.log(`🛠 Adjusted: +${extraQty} to ${last.title}, new total ₹${last.itemTotal}`);
    }
  }

  // Fill small gap with service charges
  const feeOptions = [
    { title: "Packaging Fee", unitPrice: 20 },
    { title: "Service Charge", unitPrice: 15 },
  ];

  for (const fee of feeOptions) {
    if (remaining >= fee.unitPrice) {
      selectedProducts.push({
        productId: null,
        title: fee.title,
        unitPrice: fee.unitPrice,
        quantity: 1,
        itemTotal: fee.unitPrice,
      });
      console.log(`➕ Added Fee: ${fee.title} ₹${fee.unitPrice}`);
      remaining -= fee.unitPrice;
    }
  }

  // If still a small remainder, try again with final product qty
  if (remaining > 0 && selectedProducts.length > 0) {
    const last = selectedProducts[selectedProducts.length - 1];
    const extraQty = Math.floor(remaining / last.unitPrice);
    const extraTotal = extraQty * last.unitPrice;

    if (extraQty > 0) {
      last.quantity += extraQty;
      last.itemTotal += extraTotal;
      remaining -= extraTotal;
      console.log(`⚙️ Final Tweak: +${extraQty} to ${last.title}, new total ₹${last.itemTotal}`);
    }
  }

  // Add shipping if subtotal < 500
  const subtotal = selectedProducts
    .filter(p => p.productId) // ignore fees
    .reduce((acc, item) => acc + item.itemTotal, 0);

  let shippingAdded = false;
  if (subtotal < 500) {
    selectedProducts.push({
      productId: null,
      title: "Shipping Fee",
      unitPrice: 50,
      quantity: 1,
      itemTotal: 50,
    });
    console.log("🚚 Added Shipping Fee ₹50");
    shippingAdded = true;
  }

  const finalTotal = selectedProducts.reduce((acc, p) => acc + p.itemTotal, 0);
  console.log("🧾 Final Total:", finalTotal);
  console.log("------------------------------------------------");

  return {
    items: selectedProducts.map(({ productId, quantity, title, unitPrice, itemTotal }) => ({
      productId,
      title,
      unitPrice,
      quantity,
      itemTotal,
    })),
    total: finalTotal,
    shippingAdded,
  };
}



const uploadOrders = async (req, res) => {
  try {
    const { orders } = req.body || {};
    if (!Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const products = await Product.find({}, "_id title finalPrice");

    const InstertingOrders = orders.map((order) => {
      const { items: productDetails, total: actualAmount, shippingAdded } =
        generateProductDetails(order.Amount, products);

      const parts = order.Description.split("/");
      const name = parts[2];
      const upiId = parts[1];
      const date = new Date(order.date).toISOString().slice(0, 10);

      const uid = new ShortUniqueId({ length: 6, dictionary: "alphanum_upper" });
      const datePart = date.replace(/-/g, "");
      const now = new Date();
      const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "");
      const orderId = `ORD-${datePart}${timePart}-${uid.rnd()}`;

      return {
        items: productDetails,
        totalAmount: actualAmount,
        shippingCost: shippingAdded ? 50 : 0,
        userDetails: { date, name, upiId },
        orderUniqueId: orderId,
        paymentStatus: "Paid",
        paymentMethod: "Online",
        orderStatus: "Delivered",
      };
    });

    // const result = await Order.insertMany(InstertingOrders);
    console.log("📦 InstertingOrders Preview →", InstertingOrders);

    return res.status(200).json({
      message: "Orders generated successfully",
      count: InstertingOrders.length,
      result: InstertingOrders, // change back to result if insertMany is used
    });
  } catch (error) {
    console.log("❌ generateOrders error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  createOrder,
  verifyPayment,
  getAllOrders,
  GetOrderById,
  UpdateCheckout,
  DeleteOrder,
  uploadOrders,
  getAllOrdersAdmin
};

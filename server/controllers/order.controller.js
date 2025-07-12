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

    let shippingCost = 0;
    let totalAmount = cart.totalAmount;
    // if (totalAmount > 500) {
    //   shippingCost = 0;
    // }
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
    const orders = await Order.find({ user: req?.user?._id })
      .sort({ createdAt: -1 })
      .populate("items.productId");
    return res.status(200).json({ orders });
  } catch (error) {
    console.log("get all orders error", error);
    return res.status(500).json({ message: "get all orders server error" });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await Order.find()
      .skip(skip)
      .limit(limit)
      .populate("items.productId");

    return res
      .status(200)
      .json({ orders, totalOrders, totalPages, currentPage: page });
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
//     return { items: [], total: 0, shortfall: totalPrice };
//   }

//   const sortedProducts = [...products].sort((a, b) => b.finalPrice - a.finalPrice);

//   let bestMatch = null;
//   let foundExact = false;

//   for (let i = 0; i < sortedProducts.length && !foundExact; i++) {
//     const p1 = sortedProducts[i];
//     if (p1.finalPrice > totalPrice) continue;

//     const maxQty1 = Math.floor(totalPrice / p1.finalPrice);
//     for (let q1 = 1; q1 <= maxQty1 && !foundExact; q1++) {
//       const total1 = p1.finalPrice * q1;
//       if (total1 === totalPrice) {
//         bestMatch = [{
//           productId: p1._id,
//           title: p1.title,
//           unitPrice: p1.finalPrice,
//           quantity: q1,
//           itemTotal: total1,
//         }];
//         foundExact = true;
//         break;
//       }

//       for (let j = i + 1; j < sortedProducts.length && !foundExact; j++) {
//         const p2 = sortedProducts[j];
//         const remaining2 = totalPrice - total1;
//         if (p2.finalPrice > remaining2) continue;

//         const maxQty2 = Math.floor(remaining2 / p2.finalPrice);
//         for (let q2 = 1; q2 <= maxQty2; q2++) {
//           const total2 = p2.finalPrice * q2;
//           const combinedTotal = total1 + total2;

//           if (combinedTotal === totalPrice) {
//             bestMatch = [
//               {
//                 productId: p1._id,
//                 title: p1.title,
//                 unitPrice: p1.finalPrice,
//                 quantity: q1,
//                 itemTotal: total1,
//               },
//               {
//                 productId: p2._id,
//                 title: p2.title,
//                 unitPrice: p2.finalPrice,
//                 quantity: q2,
//                 itemTotal: total2,
//               },
//             ];
//             foundExact = true;
//             break;
//           }

//           for (let k = j + 1; k < sortedProducts.length && !foundExact; k++) {
//             const p3 = sortedProducts[k];
//             const remaining3 = totalPrice - combinedTotal;
//             if (p3.finalPrice > remaining3) continue;

//             const maxQty3 = Math.floor(remaining3 / p3.finalPrice);
//             for (let q3 = 1; q3 <= maxQty3; q3++) {
//               const total3 = p3.finalPrice * q3;
//               const totalAll = total1 + total2 + total3;

//               if (totalAll === totalPrice) {
//                 bestMatch = [
//                   {
//                     productId: p1._id,
//                     title: p1.title,
//                     unitPrice: p1.finalPrice,
//                     quantity: q1,
//                     itemTotal: total1,
//                   },
//                   {
//                     productId: p2._id,
//                     title: p2.title,
//                     unitPrice: p2.finalPrice,
//                     quantity: q2,
//                     itemTotal: total2,
//                   },
//                   {
//                     productId: p3._id,
//                     title: p3.title,
//                     unitPrice: p3.finalPrice,
//                     quantity: q3,
//                     itemTotal: total3,
//                   },
//                 ];
//                 foundExact = true;
//                 break;
//               }

//               for (let l = k + 1; l < sortedProducts.length && !foundExact; l++) {
//                 const p4 = sortedProducts[l];
//                 const remaining4 = totalPrice - totalAll;
//                 if (p4.finalPrice > remaining4) continue;

//                 const maxQty4 = Math.floor(remaining4 / p4.finalPrice);
//                 for (let q4 = 1; q4 <= maxQty4; q4++) {
//                   const total4 = p4.finalPrice * q4;
//                   const totalFinal = total1 + total2 + total3 + total4;

//                   if (totalFinal === totalPrice) {
//                     bestMatch = [
//                       {
//                         productId: p1._id,
//                         title: p1.title,
//                         unitPrice: p1.finalPrice,
//                         quantity: q1,
//                         itemTotal: total1,
//                       },
//                       {
//                         productId: p2._id,
//                         title: p2.title,
//                         unitPrice: p2.finalPrice,
//                         quantity: q2,
//                         itemTotal: total2,
//                       },
//                       {
//                         productId: p3._id,
//                         title: p3.title,
//                         unitPrice: p3.finalPrice,
//                         quantity: q3,
//                         itemTotal: total3,
//                       },
//                       {
//                         productId: p4._id,
//                         title: p4.title,
//                         unitPrice: p4.finalPrice,
//                         quantity: q4,
//                         itemTotal: total4,
//                       },
//                     ];
//                     foundExact = true;
//                     break;
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }

//   if (bestMatch) {
//     return {
//       items: bestMatch,
//       total: totalPrice,
//       shortfall: 0,
//     };
//   } else {
//     return {
//       items: [],
//       total: 0,
//       shortfall: totalPrice,
//     };
//   }
// }

// function generateProductDetails(input, products) {
//   const cleaned = input.replace(/[₹Rs,\s]/g, "").trim();
//   const totalPrice = Number(cleaned);

//   if (isNaN(totalPrice)) {
//     console.log("❌ Invalid amount:", input);
//     return { items: [], total: 0 };
//   }

//   const sortedProducts = [...products].sort((a, b) => b.finalPrice - a.finalPrice);
//   const maxComboLength = 4;
//   const maxAttempts = 200;

//   function getRandomCombos(sortedList, maxItems, total, allowExactMatch = false) {
//     const results = [];

//     for (let i = 0; i < maxAttempts; i++) {
//       const temp = [];
//       let remaining = total;
//       const usedIndexes = new Set();

//       const shuffled = [...sortedList].sort(() => Math.random() - 0.5);

//       for (let j = 0; j < maxItems; j++) {
//         const candidates = shuffled.filter((p, idx) => !usedIndexes.has(idx) && p.finalPrice <= remaining);

//         if (candidates.length === 0) break;

//         const picked = candidates[Math.floor(Math.random() * candidates.length)];
//         const qty = Math.floor(remaining / picked.finalPrice);
//         if (qty <= 0) continue;

//         const chosenQty = Math.min(qty, 1 + Math.floor(Math.random() * 2)); // quantity: 1–2
//         const itemTotal = chosenQty * picked.finalPrice;

//         if (itemTotal > remaining) continue;

//         temp.push({
//           productId: picked._id,
//           title: picked.title,
//           unitPrice: picked.finalPrice,
//           quantity: chosenQty,
//           itemTotal,
//         });

//         remaining -= itemTotal;
//         usedIndexes.add(sortedList.indexOf(picked));

//         if (remaining === 0) break;
//       }

//       const sum = temp.reduce((acc, item) => acc + item.itemTotal, 0);

//       // ⚠️ Avoid exact single product match unless no other choice
//       if (
//         temp.length === 1 &&
//         temp[0].itemTotal === total &&
//         !allowExactMatch &&
//         Math.random() > 0.9 // 60% chance to skip direct match
//       ) {
//         continue;
//       }

//       if (sum === total) {
//         results.push(temp);
//         break;
//       }
//     }

//     return results[0] || [];
//   }

//   const selectedItems = getRandomCombos(sortedProducts, maxComboLength, totalPrice);
//   const subtotal = selectedItems.reduce((sum, item) => sum + item.itemTotal, 0);

//   return {
//     items: selectedItems,
//     total: subtotal,
//     serviceCharges: 0,
//     shippingAdded: false,
//   };
// }

function generateProductDetails(input, products) {
  const cleaned = input.replace(/[₹Rs,\s]/g, "").trim();
  const totalPrice = Number(cleaned);

  if (isNaN(totalPrice)) {
    console.log("❌ Invalid amount:", input);
    return { items: [], total: 0 };
  }

  const sortedProducts = [...products].sort(
    (a, b) => b.finalPrice - a.finalPrice
  );
  const maxComboLength = 4;
  const maxAttempts = 200;

  function getCombo(allowExactOneProduct = false) {
    for (let i = 0; i < maxAttempts; i++) {
      const temp = [];
      let remaining = totalPrice;
      const usedIndexes = new Set();
      const shuffled = [...sortedProducts].sort(() => Math.random() - 0.5);

      for (let j = 0; j < maxComboLength; j++) {
        const candidates = shuffled.filter(
          (p, idx) => !usedIndexes.has(idx) && p.finalPrice <= remaining
        );
        if (candidates.length === 0) break;

        const picked =
          candidates[Math.floor(Math.random() * candidates.length)];
        const maxQty = Math.floor(remaining / picked.finalPrice);
        if (maxQty <= 0) continue;

        const qty = Math.min(maxQty, 1 + Math.floor(Math.random() * 2));
        const itemTotal = qty * picked.finalPrice;
        if (itemTotal > remaining) continue;

        temp.push({
          productId: picked._id,
          title: picked.title,
          unitPrice: picked.finalPrice,
          quantity: qty,
          itemTotal,
        });

        usedIndexes.add(sortedProducts.indexOf(picked));
        remaining -= itemTotal;
        if (remaining === 0) break;
      }

      const sum = temp.reduce((acc, i) => acc + i.itemTotal, 0);

      if (sum === totalPrice) {
        if (!allowExactOneProduct && temp.length === 1) continue;
        return temp;
      }
    }

    // If no combo found, allow exact single product match
    if (!allowExactOneProduct) {
      return getCombo(true);
    }

    return [];
  }

  const selectedItems = getCombo();
  const subtotal = selectedItems.reduce((sum, item) => sum + item.itemTotal, 0);

  return {
    items: selectedItems,
    total: subtotal,
    serviceCharges: 0,
    shippingAdded: false,
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
      const {
        items: productDetails,
        total: actualAmount,
        shippingAdded,
        serviceCharges,
      } = generateProductDetails(order.Amount, products);

      const parts = order.Description.split("/");
      const name = parts[2];
      const upiId = parts[1];
      // const date = new Date(order.date).toISOString().slice(0, 10);

      const uid = new ShortUniqueId({
        length: 6,
        dictionary: "alphanum_upper",
      });

      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
      const now = new Date();
      const timePart = now.toTimeString().split(" ")[0].replace(/:/g, "");
      const orderId = `ORD-${datePart}${timePart}-${uid.rnd()}`;

      return {
        items: productDetails,
        totalAmount: actualAmount,
        serviceCharges: serviceCharges || 0,
        shippingCost: 0,
        userDetails: { date: order.date, name, upiId },
        orderUniqueId: orderId,
        paymentStatus: "Paid",
        paymentMethod: "Online",
        orderStatus: "Delivered",
      };
    });

    const result = await Order.insertMany(InstertingOrders);
    // console.log("📦 InstertingOrders Preview →", InstertingOrders);

    return res.status(200).json({
      message: "Orders generated successfully",
      count: InstertingOrders.length,
      result: result, // change back to result if insertMany is used
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
  getAllOrdersAdmin,
};

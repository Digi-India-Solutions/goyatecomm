import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";

const AddToCart = async (req, res) => {
  try {
    const { items } = req.body || {};
    const user = req.user?._id;

    if (!user || !items || items.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingCart = await Cart.findOne({ user });
    let totalAmount = existingCart?.totalAmount || 0;
    if (existingCart) {
      for (const item of items) {
        const { productId, quantity } = item;

        if (!productId || !quantity) {
          return res
            .status(400)
            .json({ message: "productId and quantity are required" });
        }
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        const productExists = existingCart.items.find(
          (item) => item.productId.toString() === product?._id.toString()
        );
        if (productExists) {
          if (productExists.quantity + quantity > product.stock) {
            return res.status(400).json({ message: "Quantity exceeds stock" });
          }
          productExists.quantity += quantity;
          totalAmount += product.finalPrice * quantity;
        } else {
          if (quantity > product.stock) {
            return res.status(400).json({ message: "Quantity exceeds stock" });
          }
          existingCart.items.push({ productId, quantity });
          totalAmount += product.finalPrice * quantity;
        }
      }
      existingCart.totalAmount = totalAmount;
      await existingCart.save();
    } else {
      for (const item of items) {
        const { productId, quantity } = item;

        if (!productId || !quantity) {
          return res
            .status(400)
            .json({ message: "productId and quantity are required" });
        }

        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        if (quantity > product.stock) {
          return res.status(400).json({ message: "Quantity exceeds stock" });
        }
        totalAmount += product.finalPrice * quantity;
        await product.save();
      }
      await Cart.create({
        user,
        items,
        totalAmount,
      });
    }
    return res.status(200).json({ message: "Product added to cart" });
  } catch (error) {
    console.log("add to cart error", error);
    return res.status(500).json({ message: "add to cart server error" });
  }
};

const RemoveFromCart = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = req.user?._id;

    if (!user || !productId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingCart = await Cart.findOne({ user }).populate(
      "items.productId"
    );
    if (existingCart) {
      const productExists = existingCart.items.find(
        (item) => item.productId._id.toString() === productId
      );
      if (productExists) {
        const priceToSubtract =
          productExists.productId.finalPrice * productExists.quantity;
        existingCart.totalAmount -= priceToSubtract;
        existingCart.items.pull(productExists);
        await existingCart.save();
      }
    }
    return res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    console.log("remove from cart error", error);
    return res.status(500).json({ message: "remove from cart server error" });
  }
};

const UpdateQuantity = async (req, res) => {
  try {
    const { productId, action } = req.body || {};
    const user = req.user._id;

    if (!user || !productId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingCart = await Cart.findOne({ user }).populate(
      "items.productId"
    );
    if (existingCart) {
      const productExists = existingCart.items.find(
        (item) => item.productId._id.toString() === productId
      );
      let totalAmount = existingCart.totalAmount || 0;
      if (productExists) {
        if (action === "increase") {
          const quantity = productExists.quantity + 1;
          if (quantity > productExists.productId.stock) {
            return res.status(400).json({ message: "Quantity exceeds stock" });
          }
          totalAmount += productExists.productId.finalPrice;
          productExists.quantity += 1;
        }
        if (action === "decrease") {
          const quantity = productExists.quantity - 1;
          if (quantity < 1) {
            return res
              .status(400)
              .json({ message: "Quantity cannot be less than 1" });
          }
          totalAmount -= productExists.productId.finalPrice;
          productExists.quantity -= 1;
        }
      }
      existingCart.totalAmount = totalAmount;
      await existingCart.save();
      return res.status(200).json({ message: "Product quantity updated" });
    }
  } catch (error) {
    console.log("update cart error", error);
    return res.status(500).json({ message: "update cart server error" });
  }
};

const getAllCarts = async (req, res) => {
  try {
    const user = req.user._id;
    const carts = await Cart.findOne({ user }).populate("items.productId");
    return res.status(200).json({ message: "All carts", carts });
  } catch (error) {
    console.log("get all carts error", error);
    return res.status(500).json({ message: "get all carts server error" });
  }
};

export { AddToCart, RemoveFromCart, UpdateQuantity, getAllCarts };

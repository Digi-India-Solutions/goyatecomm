import { Wishlist } from "../models/wishlist.model.js";

// const AddToWishlist = async (req, res) => {
//   try {
//     const { productId } = req.body || {};
//     const user = req.user._id;
//     if (!user || !productId) {
//       return res.status(400).json({ message: "All fields are required" });
//     }
//     const existingWishlist = await Wishlist.findOne({ user });
//     if (existingWishlist) {
//       const productExists = existingWishlist.products.includes(productId);
//       if (!productExists) {
//         existingWishlist.products.push(productId);
//         await existingWishlist.save();
//       }
//     } else {
//      await Wishlist.create({
//         user,
//         products: [productId],
//       });
  
//     }
//     return res.status(200).json({ message: "Product added to wishlist" });
//   } catch (error) {
//     console.log("create wishlist error", error);
//     return res.status(500).json({ message: "create wishlist server error" });
//   }
// };

const AddToWishlist = async (req, res) => {
  try {
    const { productIds } = req.body || {}; 
    const user = req.user._id;

    if (!user || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "User and productIds are required" });
    }

    const existingWishlist = await Wishlist.findOne({ user });

    if (existingWishlist) {
      const newProducts = productIds.filter(
        (id) => !existingWishlist.products.includes(id)
      );

      if (newProducts.length > 0) {
        existingWishlist.products.push(...newProducts);
        await existingWishlist.save();
      }
    } else {
      await Wishlist.create({
        user,
        products: productIds,
      });
    }

    return res.status(200).json({ message: "Products added to wishlist" });
  } catch (error) {
    console.log("create wishlist error", error);
    return res.status(500).json({ message: "Create wishlist server error" });
  }
};

const RemoveFromWishlist=async(req,res)=>{
  try {
    const {id:  productId } = req.params || {};
    const user = req.user._id;

    if (!user || !productId) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingWishlist = await Wishlist.findOne({ user });
    if (existingWishlist) {
      const productExists = existingWishlist.products.includes(productId);
      if (productExists) {
        existingWishlist.products.pull(productId);
        await existingWishlist.save();
      }
    }
    return res.status(200).json({ message: "Product removed from wishlist" });
  } catch (error) {
    console.log("create wishlist error", error);
    return res.status(500).json({ message: "create wishlist server error" });
  }
}

const getAllWishlists = async (req, res) => {
  try {
    const user = req.user._id;
    const wishlists = await Wishlist.findOne({user}).populate("products");
    return res.status(200).json({ message: "all wishlists", wishlists });
  } catch (error) {
    console.log("get all wishlists error", error);
    return res.status(500).json({ message: "get all wishlists server error" });
  }
}
export { AddToWishlist ,RemoveFromWishlist,getAllWishlists};
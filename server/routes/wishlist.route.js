import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import {
  AddToWishlist,
  getAllWishlists,
  RemoveFromWishlist,
} from "../controllers/wishlist.controller.js";
const router = Router();

router.post("/add-to-wishlist", verifyToken, AddToWishlist);
router.delete("/remove-from-wishlist/:id", verifyToken, RemoveFromWishlist);
router.get("/get-all-wishlists", verifyToken, getAllWishlists);

export default router;

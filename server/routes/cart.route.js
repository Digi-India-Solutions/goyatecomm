import { Router } from "express";
import { AddToCart, getAllCarts, RemoveFromCart, UpdateQuantity } from "../controllers/cart.controller.js";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";

const router = Router();

router.get("/get-all-carts",verifyToken, getAllCarts);
router.post("/add-to-cart",verifyToken, AddToCart);
router.put("/update-cart",verifyToken, UpdateQuantity);
router.delete("/remove-from-cart/:id",verifyToken, RemoveFromCart);

export default router;
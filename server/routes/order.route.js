import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken.middleware.js";
import { createOrder, DeleteOrder, getAllOrders, GetOrderById, UpdateCheckout } from "../controllers/order.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = Router();

router.get("/get-all-orders", verifyToken, getAllOrders);
router.get("/get-order-by-id/:id", GetOrderById);
router.post("/create-checkout",verifyToken, createOrder);
router.put("/update-order/:id", UpdateCheckout);
router.delete("/delete-order/:id",verifyAdmin, DeleteOrder);

export default router;
import { Router } from "express";
import { detectCountry } from "../controllers/currency.controller.js";

const router=Router();

router.get("/detect-country",detectCountry)

export default router
import express from "express";
import {
    getAllContactForms,
    createContactForm,
    deleteContactForm,
} from "../controllers/contactForm.controller.js";
import { verifyAdmin } from "../middlewares/verifyAdmin.middleware.js";

const router = express.Router();

router.get("/get-all-contact",verifyAdmin, getAllContactForms);
router.post("/send-contact-form", createContactForm);
router.delete("/delete-contact/:id", deleteContactForm);

export default router;
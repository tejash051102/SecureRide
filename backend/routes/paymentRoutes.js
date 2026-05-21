import express from "express";
import { createPayment, deletePayment, getPayments, updatePayment } from "../controllers/paymentController.js";
import { adminOnly, protect, verifiedOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, verifiedOnly, getPayments).post(protect, adminOnly, createPayment);
router.route("/:id").put(protect, adminOnly, updatePayment).delete(protect, adminOnly, deletePayment);

export default router;

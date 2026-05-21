import express from "express";
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from "../controllers/customerController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").get(getCustomers).post(createCustomer);
router.route("/:id").put(updateCustomer).delete(deleteCustomer);

export default router;

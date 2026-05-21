import express from "express";
import { createPolicy, deletePolicy, getPolicies, updatePolicy } from "../controllers/policyController.js";
import { adminOnly, protect, verifiedOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, verifiedOnly, getPolicies).post(protect, adminOnly, createPolicy);
router.route("/:id").put(protect, adminOnly, updatePolicy).delete(protect, adminOnly, deletePolicy);

export default router;

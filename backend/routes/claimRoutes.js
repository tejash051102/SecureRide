import express from "express";
import { createClaim, deleteClaim, getClaims, updateClaim } from "../controllers/claimController.js";
import { protect, verifiedOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, verifiedOnly, getClaims).post(protect, verifiedOnly, createClaim);
router.route("/:id").put(protect, verifiedOnly, updateClaim).delete(protect, verifiedOnly, deleteClaim);

export default router;

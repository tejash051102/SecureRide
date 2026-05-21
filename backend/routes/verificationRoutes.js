import express from "express";
import { getPendingVerifications, verifyUser } from "../controllers/verificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getPendingVerifications);
router.put("/:id/verify", protect, verifyUser);

export default router;

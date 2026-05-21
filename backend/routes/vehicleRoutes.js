import express from "express";
import { createVehicle, deleteVehicle, getVehicles, updateVehicle } from "../controllers/vehicleController.js";
import { adminOnly, protect, verifiedOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, verifiedOnly, getVehicles).post(protect, adminOnly, createVehicle);
router.route("/:id").put(protect, adminOnly, updateVehicle).delete(protect, adminOnly, deleteVehicle);

export default router;

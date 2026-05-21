import express from "express";
import { createManager, deleteManager, getManagers, updateManager } from "../controllers/managerController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").get(getManagers).post(createManager);
router.route("/:id").put(updateManager).delete(deleteManager);

export default router;

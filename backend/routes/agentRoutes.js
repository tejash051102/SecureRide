import express from "express";
import { createAgent, deleteAgent, getAgents, updateAgent } from "../controllers/agentController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").get(getAgents).post(createAgent);
router.route("/:id").put(updateAgent).delete(deleteAgent);

export default router;

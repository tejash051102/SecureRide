import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { Agent } from "../models/Agent.js";
import { Claim } from "../models/Claim.js";
import { Manager } from "../models/Manager.js";
import { Payment } from "../models/Payment.js";
import { Policy } from "../models/Policy.js";
import { User } from "../models/User.js";
import { Vehicle } from "../models/Vehicle.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { customer: req.user._id };
    const customerFilter = req.user.role === "admin" ? { role: "customer" } : { _id: req.user._id };
    const verificationRoles = req.user.role === "admin" ? ["manager", "agent", "customer"] : req.user.role === "manager" ? ["agent", "customer"] : req.user.role === "agent" ? ["customer"] : [];

    const [customers, agents, managers, pendingVerifications, vehicles, policies, claims, payments, recentClaims] = await Promise.all([
      User.countDocuments(customerFilter),
      req.user.role === "admin" ? Agent.countDocuments() : 0,
      req.user.role === "admin" ? Manager.countDocuments() : 0,
      verificationRoles.length && (req.user.role === "admin" || req.user.isVerified) ? User.countDocuments({ isVerified: false, role: { $in: verificationRoles } }) : 0,
      Vehicle.countDocuments(filter),
      Policy.countDocuments(filter),
      Claim.countDocuments(filter),
      Payment.countDocuments(filter),
      Claim.find(filter).populate("customer", "name").populate("policy", "policyNumber").sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({ customers, agents, managers, pendingVerifications, vehicles, policies, claims, payments, recentClaims });
  } catch (error) {
    next(error);
  }
});

export default router;

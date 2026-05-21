import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/", protect, (req, res) => {
  res.json(req.user);
});

router.put("/", protect, async (req, res, next) => {
  try {
    const { name, phone, address, password } = req.body;
    const user = await User.findById(req.user._id);
    user.name = name || user.name;
    user.phone = phone || "";
    user.address = address || "";
    if (password) user.password = password;
    await user.save();
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isVerified: user.isVerified
    });
  } catch (error) {
    next(error);
  }
});

export default router;

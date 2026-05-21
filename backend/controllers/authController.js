import { User } from "../models/User.js";
import generateToken from "../utils/generateToken.js";

function sendAuth(res, user) {
  res.json({
    token: generateToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role,
      isVerified: user.isVerified
    }
  });
}

export async function registerUser(req, res, next) {
  try {
    const { name, email, password, role, phone, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const selectedRole = ["admin", "manager", "agent", "customer"].includes(role) ? role : "customer";
    const user = await User.create({
      name,
      email,
      password,
      role: selectedRole,
      phone,
      address,
      isVerified: selectedRole === "admin"
    });
    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    sendAuth(res, user);
  } catch (error) {
    next(error);
  }
}

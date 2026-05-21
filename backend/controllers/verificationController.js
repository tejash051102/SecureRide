import { User } from "../models/User.js";

function allowedRolesForVerifier(role) {
  if (role === "admin") return ["manager", "agent", "customer"];
  if (role === "manager") return ["agent", "customer"];
  if (role === "agent") return ["customer"];
  return [];
}

function canVerify(req) {
  return req.user.role === "admin" || req.user.isVerified;
}

export async function getPendingVerifications(req, res, next) {
  try {
    const roles = allowedRolesForVerifier(req.user.role);

    if (!roles.length || !canVerify(req)) {
      return res.status(403).json({ message: "You are not allowed to verify accounts" });
    }

    const search = req.query.search || "";
    const users = await User.find({
      isVerified: false,
      role: { $in: roles },
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } }
      ]
    }).select("-password").sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
}

export async function verifyUser(req, res, next) {
  try {
    const roles = allowedRolesForVerifier(req.user.role);

    if (!roles.length || !canVerify(req)) {
      return res.status(403).json({ message: "You are not allowed to verify accounts" });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, isVerified: false, role: { $in: roles } },
      { isVerified: true, verifiedBy: req.user._id, verifiedAt: new Date() },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Pending account not found or not allowed" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
}

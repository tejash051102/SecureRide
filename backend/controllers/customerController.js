import { User } from "../models/User.js";

export async function getCustomers(req, res, next) {
  try {
    const search = req.query.search || "";
    const customers = await User.find({
      role: "customer",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ]
    }).select("-password").sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req, res, next) {
  try {
    const { name, email, phone, address, password = "password123" } = req.body;
    const customer = await User.create({ name, email, phone, address, password, role: "customer", isVerified: true, verifiedBy: req.user._id, verifiedAt: new Date() });
    res.status(201).json(await User.findById(customer._id).select("-password"));
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(req, res, next) {
  try {
    const customer = await User.findOneAndUpdate(
      { _id: req.params.id, role: "customer" },
      req.body,
      { new: true, runValidators: true }
    ).select("-password");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(req, res, next) {
  try {
    const customer = await User.findOneAndDelete({ _id: req.params.id, role: "customer" });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted" });
  } catch (error) {
    next(error);
  }
}

import { Policy } from "../models/Policy.js";

export async function getPolicies(req, res, next) {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const base = req.user.role === "admin" ? {} : { customer: req.user._id };
    const policies = await Policy.find({
      ...base,
      ...(status ? { status } : {}),
      $or: [
        { policyNumber: { $regex: search, $options: "i" } },
        { policyType: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } }
      ]
    })
      .populate("customer", "name email")
      .populate("vehicle", "registrationNo make model")
      .sort({ createdAt: -1 });
    res.json(policies);
  } catch (error) {
    next(error);
  }
}

export async function createPolicy(req, res, next) {
  try {
    const policy = await Policy.create(req.body);
    res.status(201).json(await policy.populate([{ path: "customer", select: "name email" }, { path: "vehicle", select: "registrationNo make model" }]));
  } catch (error) {
    next(error);
  }
}

export async function updatePolicy(req, res, next) {
  try {
    const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate("customer", "name email")
      .populate("vehicle", "registrationNo make model");
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.json(policy);
  } catch (error) {
    next(error);
  }
}

export async function deletePolicy(req, res, next) {
  try {
    const policy = await Policy.findByIdAndDelete(req.params.id);
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.json({ message: "Policy deleted" });
  } catch (error) {
    next(error);
  }
}

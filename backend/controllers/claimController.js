import { Claim } from "../models/Claim.js";

export async function getClaims(req, res, next) {
  try {
    const search = req.query.search || "";
    const status = req.query.status || "";
    const base = req.user.role === "admin" ? {} : { customer: req.user._id };
    const claims = await Claim.find({
      ...base,
      ...(status ? { status } : {}),
      $or: [
        { reason: { $regex: search, $options: "i" } },
        { status: { $regex: search, $options: "i" } }
      ]
    })
      .populate("customer", "name email")
      .populate("policy", "policyNumber policyType")
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    next(error);
  }
}

export async function createClaim(req, res, next) {
  try {
    const customer = req.user.role === "admin" && req.body.customer ? req.body.customer : req.user._id;
    const claim = await Claim.create({ ...req.body, customer, status: req.body.status || "Pending" });
    res.status(201).json(await claim.populate([{ path: "customer", select: "name email" }, { path: "policy", select: "policyNumber policyType" }]));
  } catch (error) {
    next(error);
  }
}

export async function updateClaim(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, customer: req.user._id };
    const allowed = req.user.role === "admin" ? req.body : {
      incidentDate: req.body.incidentDate,
      claimAmount: req.body.claimAmount,
      reason: req.body.reason
    };
    const claim = await Claim.findOneAndUpdate(filter, allowed, {
      new: true,
      runValidators: true
    })
      .populate("customer", "name email")
      .populate("policy", "policyNumber policyType");
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json(claim);
  } catch (error) {
    next(error);
  }
}

export async function deleteClaim(req, res, next) {
  try {
    const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, customer: req.user._id };
    const claim = await Claim.findOneAndDelete(filter);
    if (!claim) return res.status(404).json({ message: "Claim not found" });
    res.json({ message: "Claim deleted" });
  } catch (error) {
    next(error);
  }
}

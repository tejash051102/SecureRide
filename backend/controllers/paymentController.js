import { Payment } from "../models/Payment.js";

export async function getPayments(req, res, next) {
  try {
    const search = req.query.search || "";
    const base = req.user.role === "admin" ? {} : { customer: req.user._id };
    const payments = await Payment.find(base)
      .populate("customer", "name email")
      .populate("policy", "policyNumber policyType")
      .sort({ paymentDate: -1 });
    const filtered = payments.filter((payment) => {
      const text = `${payment.customer?.name || ""} ${payment.policy?.policyNumber || ""} ${payment.method} ${payment.status}`;
      return text.toLowerCase().includes(search.toLowerCase());
    });
    res.json(filtered);
  } catch (error) {
    next(error);
  }
}

export async function createPayment(req, res, next) {
  try {
    const payload = { ...req.body };
    if (!payload.paymentDate) delete payload.paymentDate;
    const payment = await Payment.create(payload);
    res.status(201).json(await payment.populate([{ path: "customer", select: "name email" }, { path: "policy", select: "policyNumber policyType" }]));
  } catch (error) {
    next(error);
  }
}

export async function updatePayment(req, res, next) {
  try {
    const payload = { ...req.body };
    if (!payload.paymentDate) delete payload.paymentDate;
    const payment = await Payment.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    })
      .populate("customer", "name email")
      .populate("policy", "policyNumber policyType");
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
  } catch (error) {
    next(error);
  }
}

export async function deletePayment(req, res, next) {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json({ message: "Payment deleted" });
  } catch (error) {
    next(error);
  }
}

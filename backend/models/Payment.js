import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    policy: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    method: { type: String, enum: ["Cash", "Card", "UPI", "Net Banking"], default: "UPI" },
    status: { type: String, enum: ["Paid", "Pending", "Failed"], default: "Paid" }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);

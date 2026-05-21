import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    policyNumber: { type: String, required: true, unique: true, trim: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", required: true },
    policyType: { type: String, enum: ["Third Party", "Comprehensive", "Own Damage"], required: true },
    premiumAmount: { type: Number, required: true },
    coverageAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Expired", "Cancelled"], default: "Active" }
  },
  { timestamps: true }
);

export const Policy = mongoose.model("Policy", policySchema);

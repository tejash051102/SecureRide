import mongoose from "mongoose";

const claimSchema = new mongoose.Schema(
  {
    policy: { type: mongoose.Schema.Types.ObjectId, ref: "Policy", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    incidentDate: { type: Date, required: true },
    claimAmount: { type: Number, required: true },
    reason: { type: String, required: true, trim: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
  },
  { timestamps: true }
);

export const Claim = mongoose.model("Claim", claimSchema);

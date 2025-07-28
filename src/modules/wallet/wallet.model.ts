import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  balance: { type: Number, default: 50 },
  isBlocked: { type: Boolean, default: false },
});

export const Wallet = mongoose.model("Wallet", walletSchema);

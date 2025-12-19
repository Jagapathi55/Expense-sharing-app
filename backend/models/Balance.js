import mongoose from "mongoose";

const balanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balances: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

const Balance = mongoose.model("Balance", balanceSchema);
export default Balance;

import mongoose, { model, Schema } from "mongoose";
import { IMemberShip } from "./memberShip.interface";

const memberShipSchema = new Schema<IMemberShip>(
  {
    name: { type: String, required: true }, // e.g., "Weekly Pass", "6-Month Package"

    type: {
      type: String,
      enum: ["recurring", "onetime"],
      required: true,
    },

    interval: {
      type: String,
      enum: ["day", "week", "month", "year"],
      required: function () {
        return this.type === "recurring";
      },
    },

    durationInMonths: {
      type: Number,
      required: function () {
        return this.type === "onetime";
      },
    },

    ridesPerMonth: { type: Number, required: true },

    refundableDeposit: { type: Number, required: true },
    signUpFee: { type: Number, required: true },

    price: { type: Number, required: true }, // 💡 I renamed "pricing" → "price" for clarity

    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const MemberShip = model<IMemberShip>("MemberShip", memberShipSchema);

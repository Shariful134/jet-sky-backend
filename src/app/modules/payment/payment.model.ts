import mongoose, { Schema, model } from "mongoose";
import { IPayment } from "./pyament.interface";

const paymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    adventurePurchaseId: {
      type: Schema.Types.ObjectId,
      ref: "AdventurePack",
      required: false,
    },
    rentPurchaseId: {
      type: Schema.Types.ObjectId,
      ref: "Rent",
      required: false,
    },
    jetSkyId: {
      type: Schema.Types.ObjectId,
      ref: "JetSky",
      required: false,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
    },
    type: {
      type: String,
      enum: ["recurring", "onetime"],
      required: true,
    },
    ridesNumber: {
      type: Number,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    stripePaymentIntentId: { type: String }, 
    status: {
      type: String,
      enum: ["active", "pending", "canceled", "expired"],
      default: "pending",
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", paymentSchema);

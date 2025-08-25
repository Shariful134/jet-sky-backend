import { Schema, model } from "mongoose";
import { IbookingAdventurePack } from "./adventureBooking.interface";

const bookingAdventurePackSchema = new Schema<IbookingAdventurePack>(
  {
    adventurePackId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AdventurePack", 
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ridesNumber: {
      type: Number,
      required: true,
    },
    ridesPricing: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    expireDate: {
      type: Date,
      required: true,
    },
    rideComplete: {
      type: Number,
      default: 0,
    },
    rideRemaining: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// BookingAdventurePack Model
export const BookingAdventurePack = model<IbookingAdventurePack>(
  "BookingAdventurePack",
  bookingAdventurePackSchema
);

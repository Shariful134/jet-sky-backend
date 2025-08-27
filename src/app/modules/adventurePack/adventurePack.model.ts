import { model, Schema } from "mongoose";
import { IAdventurePack } from "./adventurePack.interface";

const adventurePackSchema = new Schema<IAdventurePack>(
  { 
    jet_skyId: {
      type: Schema.Types.ObjectId,
      ref: "JetSky", 
      required: true,
    },
    title: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    ridesPricing3: { type: Number, required: true },
    ridesPricing5: { type: Number, required: true },
    ridesPricing8: { type: Number, required: true },
    refundAmount: { type: Number, required: true },
    feature_list: { type: [String], default: [] , required: false  }
    
  },
  { timestamps: true }
);

export const AdventurePack = model<IAdventurePack>('AdventurePack', adventurePackSchema);


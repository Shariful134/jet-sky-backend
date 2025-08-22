import { model, Schema } from "mongoose";
import { IAdventurePack } from "./adventurePack.interface";

const adventurePackSchema = new Schema<IAdventurePack>(
  {
    title: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    ridesPricing3: { type: Number, required: true },
    ridesPricing5: { type: Number, required: true },
    ridesPricing8: { type: Number, required: true },
    refundAmount: { type: Number, required: true },
    image:{type:String, required:true}
    
  },
  { timestamps: true }
);

export const AdventurePack = model<IAdventurePack>('AdventurePack', adventurePackSchema);


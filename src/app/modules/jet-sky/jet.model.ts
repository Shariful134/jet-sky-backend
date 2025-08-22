import { model, Schema } from "mongoose";
import { IJetSky } from "./jet.interface";

const jetSkySchema = new Schema<IJetSky>(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    hp: { type: Number, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const JetSky = model<IJetSky>('JetSky', jetSkySchema);
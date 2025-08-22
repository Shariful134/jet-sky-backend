import mongoose, { model, Schema } from "mongoose";
import { IRent } from "./rents.interface";

const rentSchema = new Schema<IRent>(
    {
      
        model: { type: String, required: true },
        hp: { type: String, required: true },
        features: { type: String, required: true },
        pricing: { type: Number, required: true },


    },
    { timestamps: true }
);

export const Rent = model<IRent>('Rent', rentSchema );



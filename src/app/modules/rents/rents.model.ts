import mongoose, { model, Schema } from "mongoose";
import { IRent } from "./rents.interface";

const rentSchema = new Schema<IRent>(
    {
        jet_skyId: {
            type: Schema.Types.ObjectId,
            ref: "JetSky",
            required: true,
        },
        model: { type: String, required: true },
        hp: { type: Number, required: true },

        price: { type: Number, required: true },

        feature_list: { type: [String], default: [] }
    },
    { timestamps: true }
);

export const Rent = model<IRent>('Rent', rentSchema);



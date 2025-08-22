import mongoose, { model, Schema } from "mongoose";
import { IMemberShip } from "./memberShip.interface";

const memberShipSchema = new Schema<IMemberShip>(
    {
      
        duration: { type: Number, required: true },
        ridesPerMonth: { type: Number, required: true },
        refundableDeposit: { type: Number, required: true },
        signUpFee: { type: Number, required: true },
        pricing: { type: Number, required: true },
        description: { type: String, required: true },

    },
    { timestamps: true }
);

export const MemberShip = model<IMemberShip>('MemberShip', memberShipSchema);


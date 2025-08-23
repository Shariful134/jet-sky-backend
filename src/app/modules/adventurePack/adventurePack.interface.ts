import { Types } from "mongoose";

export interface IAdventurePack {
jet_skyId: Types.ObjectId;
title:string;
discountPercentage:number;
ridesPricing3:number;
ridesPricing5:number;
ridesPricing8:number;
refundAmount:number;
feature_list:string[]
}
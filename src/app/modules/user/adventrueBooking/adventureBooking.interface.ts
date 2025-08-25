import { Types } from "mongoose";

export interface IbookingAdventurePack {
adventurePackId: Types.ObjectId;
userId: Types.ObjectId;
ridesNumber:number;
ridesPricing:number;
startDate:Date;
expireDate:Date;
rideComplete:number;
rideRemaining:number;
}
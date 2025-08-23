import { Types } from "mongoose";

export interface IRent {
    jet_skyId: Types.ObjectId;
model:string;
hp:string;
features:string;
pricing:number;
feature_list:string[]
}
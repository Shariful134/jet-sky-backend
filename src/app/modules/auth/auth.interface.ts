import { Model } from "mongoose";
import { USER_ROLE } from "./auth.constant";

export interface IUser {
  _id?: string;
  firstName?:string;
  lastName?:string;
  name: string;
  email: string;
  phone:string;
  country:string;
  role: 'Admin' | 'Administrator' | 'User';
  password: string;
  introduction?:string;
  address?:string;
  profileImage?:string;
  createdAt: string;
  updatedAt: string;
}


export type TUserLogin = {
  email: string;
  password: string;
};

//create statick method for using  model
export interface UserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser>;
  isPasswordMatched(
    planTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

export type TUserRole = keyof typeof USER_ROLE;
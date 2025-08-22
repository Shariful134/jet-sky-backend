import  {  model, Schema } from "mongoose";
import { IUser, UserModel } from "./auth.interface";
import bcrypt from 'bcrypt';
import config from "../../../config";

// Schema Definition
const userSchema = new Schema<IUser>(
  {
    firstName: { type: String },
    lastName: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    country: { type: String,required: true },
    password: { type: String, required: true },
    introduction: { type: String },
    address: { type: String },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ['Admin', 'Administrator','User'],
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);


// hashing password and save into DB
userSchema.pre('save', async function (next) {
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

userSchema.statics.isUserExistsByEmail = async function (email: string) {
  return await User.findOne({ email }).select('+password');
};

// check password
userSchema.statics.isPasswordMatched = async function (
  planTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(planTextPassword, hashedPassword);
};

export const User = model<IUser, UserModel>('User', userSchema);
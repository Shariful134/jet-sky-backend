import { StatusCodes } from 'http-status-codes';
import nodemailer from "nodemailer";
// import crypto from "crypto";
import bcrypt from "bcrypt";
import { User } from './auth.model';


import jwt from 'jsonwebtoken';
import AppError from '../../../errors/AppError';
import { IUser, TUserLogin } from './auth.interface';
import config from '../../../config';
import { CustomJwtPayload } from '../../../interface';
import { Request } from 'express';


// Register Admin
const registerAdminIntoDB = async (payload: IUser) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email Already Registered!");
  }
  const result = await User.create({ ...payload, role: "Admin" });

  const { _id, name, email, phone, country, role, createdAt, updatedAt } = result;
  return { _id, name, email, phone, country, role, createdAt, updatedAt };
};

// Register Administrator 
const registerAdministratorIntoDB = async (payload: IUser) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email Already Registered!");
  }
  const result = await User.create({ ...payload, role: "Administrator" });

  const { _id, name, email, phone, country, role, createdAt, updatedAt } = result;
  return { _id, name, email, phone, country, role, createdAt, updatedAt };
};

//register User
const registerUserIntoDB = async (payload: IUser) => {
  const user = await User.isUserExistsByEmail(payload.email);
  if (user) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email Already Registered!");
  }
  const result = await User.create({ ...payload, role: "User" });

  const { _id, name, email, phone, country, role, createdAt, updatedAt } = result;
  return { _id, name, email, phone, country, role, createdAt, updatedAt };
};

// loggin user
const loginUserIntoDB = async (payload: TUserLogin) => {
  const user = await User.isUserExistsByEmail(payload.email);

  //checking user is exists
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User is not found!');
  }

  //checking if the password is correct or uncorrect
  if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Password does not match!');
  }

  const jwtPayload = {
    id: user._id,
    userEmail: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
    expiresIn: '30d',
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.jwt_refresh_secret as string,
    {
      expiresIn: '30d',
    },
  );

  return { accessToken, refreshToken };
};


// Get Single User
const getSingleUserIntoDB = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not Found!');
  }
  return result;
};

// Get All User with administrator and without admin
const getAllUserIntoDB = async () => {
  const result = await User.find();
  const users = result?.filter((user) => user.role !== "Admin")

  //checking user is exists
  if (!users) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not Found!');
  }
  return users;
};


// Delete User
const deleteUserIntoDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);

  //checking user is exists
  if (!result) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not Found!');
  }

  return result;
};


//Updated User
const updateUserIntoDB = async (id: string, payload: Partial<IUser>, req: Request) => {
  const user = await User.findById(id);
  console.log(id)

  // checking user is exists
  if (!user) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'User is not Found!');
  }
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized - Token missing");
  }

  // if token is Bearer then do split 
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;
  const findUserEmail = user?.email

  console.log("Token: ", token)


  let decoded;
  try {
    decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as CustomJwtPayload;
  } catch (error) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
  }

  const { userEmail, role, iat, exp } = decoded;
console.log(findUserEmail, userEmail)

  if (findUserEmail?.toLowerCase().trim() !== userEmail?.toLowerCase().trim()) {
  throw new AppError(StatusCodes.UNAUTHORIZED, 'You are Unauthorized!');
}

  const result = await User.findByIdAndUpdate({ _id: id }, payload, { new: true })
  return result;
};



// forgot password service
const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email }).select(
  "+resetPasswordOtp +resetPasswordExpiry"
);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP + Expiry in DB
  user.resetPasswordOtp = otp;
  user.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
  await user.save();

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.smtp_user,
      pass: config.smtp_pass,
    },
  });

  await transporter.sendMail({
    from: config.smtp_user,
    to: user.email,
    subject: "Reset your password",
    text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
  });

  return { email: user.email };
};

// reset password service
const resetPassword = async (email: string, otp: string, newPassword: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found!");
  }

  if (
    user.resetPasswordOtp !== otp ||
    !user.resetPasswordExpiry ||
    user.resetPasswordExpiry < new Date()
  ) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid or expired OTP!");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.resetPasswordOtp = undefined;
  user.resetPasswordExpiry = undefined;
  await user.save();

  return true;
};

export const authServices = {
  registerAdminIntoDB,
  registerAdministratorIntoDB,
  registerUserIntoDB,
  loginUserIntoDB,
  getAllUserIntoDB,
  getSingleUserIntoDB,
  deleteUserIntoDB,
  updateUserIntoDB,
  forgotPassword,
  resetPassword

};

// // Get Single Administrator
// const getSingleAdministratorIntoDB = async (email: string) => {
//   const result = await User.findOne({ email });
//   if (result?.role !== 'Administrator') {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Administrator is not Found!');
//   }
//   if (!result) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Administrator is not Found!');
//   }
//   return result;
// };

// // Get All Administrator
// const getAllAdministratorIntoDB = async () => {
//   const result = await User.find();

//   const administrator = result.filter((administrator) => administrator.role === 'Administrator');

//   //checking user is exists
//   if (!administrator) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Administrator is not Found!');
//   }
//   return administrator;
// };



// // Delete User
// const deleteAdministratorIntoDB = async (email: string) => {
//   const user = await User.findOneAndDelete({ email });

//   //checking user is exists
//   if (user?.role !== 'Administrator') {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Administrator is not Found!');
//   }

//   return user;
// };







// Registerd Trainer
// const registeredTrainerIntoDB = async (payload: IUsers) => {
//   const user = await User.isUserExistsByEmail(payload.email);

//   //checking user is exists
//   if (user) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Email Already Registered!');
//   }
//   const trainer = { ...payload, role: 'Trainer' };
//   const result = await User.create(trainer);
//   const { _id, name, email, role, createdAt, updatedAt } = result;
//   return {
//     _id,
//     name,
//     email,
//     role,
//     createdAt,
//     updatedAt,
//   };
// };



// // Registered Trainee
// const registeredTraineeIntoDB = async (payload: IUsers) => {
//   const user = await User.isUserExistsByEmail(payload.email);

//   //checking user is exists
//   if (user) {
//     throw new AppError(StatusCodes.BAD_REQUEST, 'Email Already Registered!');
//   }
//   const trainer = { ...payload, role: 'Trainee' };
//   const result = await User.create(trainer);
//   const { _id, name, email, role, createdAt, updatedAt } = result;
//   return {
//     _id,
//     name,
//     email,
//     role,
//     createdAt,
//     updatedAt,
//   };
// };

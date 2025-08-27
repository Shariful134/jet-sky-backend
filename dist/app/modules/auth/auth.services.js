"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const http_status_codes_1 = require("http-status-codes");
const nodemailer_1 = __importDefault(require("nodemailer"));
// import crypto from "crypto";
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_model_1 = require("./auth.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const config_1 = __importDefault(require("../../../config"));
// Register Admin
const registerAdminIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExistsByEmail(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email Already Registered!");
    }
    const result = yield auth_model_1.User.create(Object.assign(Object.assign({}, payload), { role: "Admin" }));
    const { _id, name, email, phone, country, role, createdAt, updatedAt } = result;
    return { _id, name, email, phone, country, role, createdAt, updatedAt };
});
// Register Administrator 
const registerAdministratorIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExistsByEmail(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email Already Registered!");
    }
    const result = yield auth_model_1.User.create(Object.assign(Object.assign({}, payload), { role: "Administrator" }));
    const { _id, name, email, phone, country, role, createdAt, updatedAt } = result;
    return { _id, name, email, phone, country, role, createdAt, updatedAt };
});
//register User
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExistsByEmail(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Email Already Registered!");
    }
    const result = yield auth_model_1.User.create(Object.assign(Object.assign({}, payload), { role: "User" }));
    const { _id, name, email, phone, country, role, createdAt, updatedAt } = result;
    return { _id, name, email, phone, country, role, createdAt, updatedAt };
});
// loggin user
const loginUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.isUserExistsByEmail(payload.email);
    //checking user is exists
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, 'User is not found!');
    }
    //checking if the password is correct or uncorrect
    if (!(yield auth_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Password does not match!');
    }
    const jwtPayload = {
        id: user._id,
        userEmail: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_access_secret, {
        expiresIn: '30d',
    });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt_refresh_secret, {
        expiresIn: '30d',
    });
    return { accessToken, refreshToken };
});
// Get Single User
const getSingleUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not Found!');
    }
    return result;
});
// Get All User with administrator and without admin
const getAllUserIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.find();
    const users = result === null || result === void 0 ? void 0 : result.filter((user) => user.role !== "Admin");
    //checking user is exists
    if (!users) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not Found!');
    }
    return users;
});
// Delete User
const deleteUserIntoDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_model_1.User.findByIdAndDelete(id);
    //checking user is exists
    if (!result) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not Found!');
    }
    return result;
});
//Updated User
const updateUserIntoDB = (id, payload, req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findById(id);
    console.log(id);
    // checking user is exists
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, 'User is not Found!');
    }
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "Unauthorized - Token missing");
    }
    // if token is Bearer then do split 
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
    const findUserEmail = user === null || user === void 0 ? void 0 : user.email;
    console.log("Token: ", token);
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_secret);
    }
    catch (error) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }
    const { userEmail, role, iat, exp } = decoded;
    console.log(findUserEmail, userEmail);
    if ((findUserEmail === null || findUserEmail === void 0 ? void 0 : findUserEmail.toLowerCase().trim()) !== (userEmail === null || userEmail === void 0 ? void 0 : userEmail.toLowerCase().trim())) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'You are Unauthorized!');
    }
    const result = yield auth_model_1.User.findByIdAndUpdate({ _id: id }, payload, { new: true });
    return result;
});
// forgot password service
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findOne({ email }).select("+resetPasswordOtp +resetPasswordExpiry");
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Save OTP + Expiry in DB
    user.resetPasswordOtp = otp;
    user.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    yield user.save();
    // Send OTP via email
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: config_1.default.smtp_user,
            pass: config_1.default.smtp_pass,
        },
    });
    yield transporter.sendMail({
        from: config_1.default.smtp_user,
        to: user.email,
        subject: "Reset your password",
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });
    return { email: user.email };
});
// reset password service
const resetPassword = (email, otp, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "User not found!");
    }
    if (user.resetPasswordOtp !== otp ||
        !user.resetPasswordExpiry ||
        user.resetPasswordExpiry < new Date()) {
        throw new AppError_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Invalid or expired OTP!");
    }
    // hash password
    const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpiry = undefined;
    yield user.save();
    return true;
});
exports.authServices = {
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

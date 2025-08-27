"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberShipValidation = void 0;
const zod_1 = require("zod");
// Create MemberShip Schema
const memberShipCreateSchema = zod_1.z.object({
    body: zod_1.z.object({
        duration: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Duration is required",
            invalid_type_error: "Duration must be a number",
        }).positive("Duration must be greater than 0")),
        ridesPerMonth: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Rides per month is required",
            invalid_type_error: "Rides per month must be a number",
        }).positive("Rides per month must be greater than 0")),
        refundableDeposit: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Refundable deposit is required",
            invalid_type_error: "Refundable deposit must be a number",
        }).nonnegative("Refundable deposit cannot be negative")),
        signUpFee: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Sign-up fee is required",
            invalid_type_error: "Sign-up fee must be a number",
        }).nonnegative("Sign-up fee cannot be negative")),
        pricing: zod_1.z.preprocess((val) => Number(val), zod_1.z.number({
            required_error: "Pricing is required",
            invalid_type_error: "Pricing must be a number",
        }).positive("Pricing must be greater than 0")),
        description: zod_1.z
            .string({
            required_error: "Description is required",
            invalid_type_error: "Description must be a string",
        })
            .min(1, "Description cannot be empty")
            .trim(),
    }),
});
// Update MemberShip Schema (all fields optional)
const memberShipUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        duration: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive("Duration must be greater than 0")).optional(),
        ridesPerMonth: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive("Rides per month must be greater than 0")).optional(),
        refundableDeposit: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().nonnegative("Refundable deposit cannot be negative")).optional(),
        signUpFee: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().nonnegative("Sign-up fee cannot be negative")).optional(),
        pricing: zod_1.z.preprocess((val) => (val !== undefined ? Number(val) : val), zod_1.z.number().positive("Pricing must be greater than 0")).optional(),
        description: zod_1.z.string().trim().optional(),
    }),
});
exports.memberShipValidation = {
    memberShipCreateSchema,
    memberShipUpdateSchema,
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = exports.userRoleEnum = void 0;
const zod_1 = require("zod");
exports.userRoleEnum = zod_1.z.enum(['Admin', 'Administrator', 'User']).optional();
const userRegisterSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .nonempty('Name is required')
            .trim(),
        email: zod_1.z
            .string()
            .nonempty('Email is required')
            .email('Invalid email format')
            .trim(),
        phone: zod_1.z
            .string()
            .nonempty('Phone is required')
            .trim(),
        country: zod_1.z
            .string()
            .nonempty('Country is required')
            .trim().optional(),
        drivingLicense: zod_1.z
            .string()
            .nonempty('Country is required')
            .trim().optional(),
        password: zod_1.z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .trim(),
        role: exports.userRoleEnum,
    }),
});
const userRegisterUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        firstName: zod_1.z.string().trim().optional(),
        lastName: zod_1.z.string().trim().optional(),
        name: zod_1.z.string().nonempty('Name is required').trim().optional(),
        email: zod_1.z.string().email('Invalid email format').trim().optional(),
        phone: zod_1.z.string().trim().optional(),
        country: zod_1.z.string().trim().optional(),
        drivingLicense: zod_1.z.string().trim().optional(),
        role: exports.userRoleEnum,
        password: zod_1.z.string().min(6, 'Password must be at least 6 characters').trim().optional(),
        introduction: zod_1.z.string().trim().optional(),
        address: zod_1.z.string().trim().optional(),
        image: zod_1.z.string().url('Image must be a valid URL').optional(),
    }),
});
const changesPasswordUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string().nonempty('Current Password is required').trim(),
        newPassword: zod_1.z.string().email('New Password is required').trim(),
    }),
});
const loginValidationschema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().nonempty('Email is required'),
        password: zod_1.z.string().nonempty('Password is required'),
    }),
});
exports.authValidation = {
    userRegisterSchema,
    loginValidationschema,
    userRegisterUpdateSchema,
    changesPasswordUpdateSchema
    //   updatedTrainerValidationSchema,
};

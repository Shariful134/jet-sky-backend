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
            .trim(),
        password: zod_1.z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .trim(),
        role: exports.userRoleEnum,
    }),
});
const userRegisterUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .nonempty('Name is required')
            .trim()
            .optional(),
        email: zod_1.z
            .string()
            .nonempty('Email is required')
            .email('Invalid email format')
            .trim().optional(),
        phone: zod_1.z
            .string()
            .nonempty('Phone is required')
            .trim().optional(),
        country: zod_1.z
            .string()
            .nonempty('Country is required')
            .trim().optional(),
        password: zod_1.z
            .string()
            .min(6, 'Password must be at least 6 characters')
            .trim().optional(),
        role: exports.userRoleEnum,
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
    userRegisterUpdateSchema
    //   updatedTrainerValidationSchema,
};

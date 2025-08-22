import { z } from 'zod';

export const userRoleEnum = z.enum(['Admin', 'Administrator', 'User']).optional();

const userRegisterSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty('Name is required')
      .trim(),

    email: z
      .string()
      .nonempty('Email is required')
      .email('Invalid email format')
      .trim(),

    phone: z
      .string()
      .nonempty('Phone is required')
      .trim(),

    country: z
      .string()
      .nonempty('Country is required')
      .trim(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .trim(),

    role: userRoleEnum,
  }),
});


const userRegisterUpdateSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty('Name is required')
      .trim()
      .optional(),

    email: z
      .string()
      .nonempty('Email is required')
      .email('Invalid email format')
      .trim().optional(),

    phone: z
      .string()
      .nonempty('Phone is required')
      .trim().optional(),

    country: z
      .string()
      .nonempty('Country is required')
      .trim().optional(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .trim().optional(),

    role: userRoleEnum,
  }),
});

const loginValidationschema = z.object({
  body: z.object({
    email: z.string().nonempty('Email is required'),
    password: z.string().nonempty('Password is required'),
  }),
});



export const authValidation = {
  userRegisterSchema,
  loginValidationschema,
  userRegisterUpdateSchema
  
//   updatedTrainerValidationSchema,
};

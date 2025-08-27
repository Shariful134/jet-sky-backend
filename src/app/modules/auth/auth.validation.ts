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
      .trim().optional(),
    drivingLicense: z
      .string()
      .nonempty('Country is required')
      .trim().optional(),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .trim(),

    role: userRoleEnum,
  }),
});


const userRegisterUpdateSchema = z.object({
  body: z.object({
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    name: z.string().nonempty('Name is required').trim().optional(),
    email: z.string().email('Invalid email format').trim().optional(),
    phone: z.string().trim().optional(),
    country: z.string().trim().optional(),
    drivingLicense: z.string().trim().optional(),
    role: userRoleEnum,
    password: z.string().min(6, 'Password must be at least 6 characters').trim().optional(),
    introduction: z.string().trim().optional(),
    address: z.string().trim().optional(),
    image: z.string().url('Image must be a valid URL').optional(),
  }),
});

const changesPasswordUpdateSchema = z.object({
  body: z.object({
    currentPassword: z.string().nonempty('Current Password is required').trim(),
    newPassword: z.string().email('New Password is required').trim(),
    
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
  userRegisterUpdateSchema,
  changesPasswordUpdateSchema

  //   updatedTrainerValidationSchema,
};

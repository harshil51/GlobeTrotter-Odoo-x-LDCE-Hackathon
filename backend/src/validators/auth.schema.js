const { z } = require('zod');

// Strong password regex: >= 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,255}$/;

const gmailValidation = z
  .string()
  .trim()
  .toLowerCase()
  .email('Must be a valid email address')
  .max(255)
  .refine(
    (val) => val.endsWith('@gmail.com'),
    { message: 'Only valid @gmail.com email addresses are allowed.' }
  );

const registerSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(100),
  lastName: z.string().trim().min(1, 'Last name is required').max(100),
  email: gmailValidation,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255)
    .regex(
      strongPasswordRegex,
      'Password must contain at least 8 characters, including 1 uppercase, 1 lowercase, 1 number, and 1 special character.'
    ),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(100).optional(),
  lastName: z.string().trim().min(1).max(100).optional(),
  phone: z.string().max(20).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  language: z.string().max(10).optional(),
  bio: z.string().optional(),
  profilePhoto: z.string().url().optional(),
});

module.exports = { registerSchema, loginSchema, updateProfileSchema };

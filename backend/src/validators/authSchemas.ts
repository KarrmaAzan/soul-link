import { z } from "zod";

export const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  username: usernameSchema,
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1),
  password: z.string().min(1),
});

export const checkUsernameSchema = z.object({
  username: usernameSchema,
});
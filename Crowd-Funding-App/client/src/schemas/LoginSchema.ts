// src/login/types.ts

import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const PasswordSchema = z.object({
  password: z.string().min(1, "Password is required."),
});

export type LoginForm = z.infer<typeof LoginSchema>;
export type PasswordForm = z.infer<typeof PasswordSchema>;
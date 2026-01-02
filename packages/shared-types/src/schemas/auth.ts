import { z } from 'zod';

export const LoginRequestSchema = z.object({
    email: z.string().email().openapi({ example: 'john@example.com' }),
    password: z.string().min(8).openapi({ example: 'password123' }),
}).openapi('LoginRequest');

export const RegisterRequestSchema = z.object({
    email: z.string().email().openapi({ example: 'john@example.com' }),
    password: z.string().min(8).openapi({ example: 'password123' }),
    firstName: z.string().min(2).openapi({ example: 'John' }),
    lastName: z.string().min(2).openapi({ example: 'Doe' }),
}).openapi('RegisterRequest');

export const AuthResponseSchema = z.object({
    accessToken: z.string(),
    user: z.object({
        id: z.string().uuid(),
        email: z.string().email(),
        firstName: z.string(),
        lastName: z.string(),
        role: z.string(),
    }),
}).openapi('AuthResponse');

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

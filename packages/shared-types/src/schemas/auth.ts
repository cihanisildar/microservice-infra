import { z } from 'zod';
import { UserRole } from '../enums.js';

export const UserPayloadSchema = z.object({
    sub: z.string().openapi({ description: 'User ID', example: '550e8400-e29b-41d4-a716-446655440000' }),
    email: z.string().email().openapi({ example: 'john@example.com' }),
    role: z.nativeEnum(UserRole).openapi({ example: UserRole.USER }),
    iat: z.number().optional(),
    exp: z.number().optional(),
}).openapi('UserPayload');

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
        role: z.nativeEnum(UserRole),
    }),
}).openapi('AuthResponse');

export type UserPayload = z.infer<typeof UserPayloadSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

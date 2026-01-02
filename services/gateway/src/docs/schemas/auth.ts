import { registry } from '../registry.js';
import {
    LoginRequestSchema,
    RegisterRequestSchema,
    AuthResponseSchema
} from '@developer-infrastructure/shared-types';

export const LoginRequest = registry.register('LoginRequest', LoginRequestSchema);
export const RegisterRequest = registry.register('RegisterRequest', RegisterRequestSchema);
export const AuthResponse = registry.register('AuthResponse', AuthResponseSchema);

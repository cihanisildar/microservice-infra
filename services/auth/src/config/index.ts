import dotenv from 'dotenv';
import { loadEnv } from '@developer-infrastructure/shared-types';

loadEnv();

export const config = {
    serviceName: 'auth-service',
    port: process.env.PORT || 3001,
    env: process.env.NODE_ENV || 'development',
    jwt: {
        secret: process.env.JWT_SECRET || 'super-secret-key-change-me-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    },
    bcrypt: {
        saltRounds: 10,
    },
};

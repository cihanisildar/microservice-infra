import { loadEnv, validateEnv, createBaseConfig, getRequiredEnv, getEnv } from '@developer-infrastructure/shared-types';

// Load environment
loadEnv();

// Validate required variables
validateEnv([
    'AUTH_SERVICE_URL',
    'AUDIT_LOG_SERVICE_URL'
]);

export const config = {
    ...createBaseConfig('gateway'),

    // Service URLs
    services: {
        auth: getRequiredEnv('AUTH_SERVICE_URL'),
        auditLog: getRequiredEnv('AUDIT_LOG_SERVICE_URL'),
        config: getEnv('CONFIG_SERVICE_URL', 'http://config:3002'),
        eventBus: getEnv('EVENT_BUS_SERVICE_URL', 'http://event-bus:3003'),
        featureFlags: getEnv('FEATURE_FLAGS_SERVICE_URL', 'http://feature-flags:3004'),
        notification: getEnv('NOTIFICATION_SERVICE_URL', 'http://notification:3006'),
        rateLimit: getEnv('RATE_LIMIT_SERVICE_URL', 'http://rate-limit:3007'),
        worker: getEnv('WORKER_SERVICE_URL', 'http://worker:3008'),
    },

    // JWT
    jwt: {
        secret: getEnv('JWT_SECRET', 'super-secret-key-change-me-in-production'),
    },

    // CORS
    cors: {
        origin: getEnv('CORS_ORIGIN', '*'),
        credentials: true,
    },

    // Rate Limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
    },
};

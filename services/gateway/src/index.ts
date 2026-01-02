import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { requestIdMiddleware } from '@developer-infrastructure/shared-types';
import { config } from './config/index.js';
import { requestLogger, logger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import healthRoutes from './routes/health.js';
import apiRoutes from './routes/api.js';
import { apiReference } from '@scalar/express-api-reference';
import { publicApiSpec, adminApiSpec } from './config/swagger.js';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request ID middleware (must be first)
app.use(requestIdMiddleware());

// Logging middleware
app.use(requestLogger);

// Rate limiting
app.use(globalRateLimiter);

// API Documentation - Public
app.use(
    '/docs',
    apiReference({
        theme: 'deepSpace',
        spec: {
            content: publicApiSpec,
        },
    }),
);

// API Documentation - Admin
app.use(
    '/docs/admin',
    apiReference({
        theme: 'deepSpace',
        spec: {
            content: adminApiSpec,
        },
    }),
);

// Health & metrics routes (no /api/v1 prefix)
app.use(healthRoutes);

// API routes
app.use('/api/v1', apiRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`🚀 ${config.serviceName} running on port ${PORT}`);
    logger.info(`Environment: ${config.env}`);
    logger.info(`CORS Origin: ${config.cors.origin}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT signal received: closing HTTP server');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', new Error(String(reason)));
    process.exit(1);
});

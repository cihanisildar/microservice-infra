import express from 'express';
import { requestIdMiddleware } from '@developer-infrastructure/shared-types';
import { config } from './config/index.js';
import { logger, requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import { eventBus } from './services/eventBus.js';

const app = express();

// Initialize Event Bus
eventBus.init().catch(err => {
    logger.error('Failed to initialize Event Bus', err);
});

app.use(express.json());
app.use(requestIdMiddleware());
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: config.serviceName });
});

// Routes
app.use('/', authRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = config.port;

app.listen(PORT, () => {
    logger.info(`🚀 ${config.serviceName} running on port ${PORT}`);
});

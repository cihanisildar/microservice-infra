import express from 'express';
import dotenv from 'dotenv';
import { MessagingService } from '@developer-infrastructure/amqp';
import { createLogger } from '@developer-infrastructure/logger';
import { userHandler, UserEvent } from './handlers/user.handler.js';

dotenv.config();

const logger = createLogger({ service: 'worker-service' });
const app = express();
const PORT = process.env.PORT || 3008;

const messaging = new MessagingService({
    serviceName: 'worker-service',
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    logger: logger,
});

async function startWorker() {
    try {
        await messaging.connect();

        // Subscribe to all user events using wildcards with modular handler
        await messaging.subscribe<UserEvent>(
            'user.events',
            'user.#',
            'worker-user-events-queue',
            async (event) => {
                logger.debug('WORKER RECEIVED EVENT', {
                    eventType: event.type,
                    source: event._metadata?.service
                });

                try {
                    await userHandler.handle(event);
                } catch (handlerError) {
                    logger.error(`Error in UserHandler for event ${event.type}:`, handlerError as Error);
                    // Burada nack/retry mantığı MessagingService içinde halledildiği için sadece logluyoruz
                }
            }
        );

        logger.info('Worker subscriptions initialized successfully.');

    } catch (error) {
        logger.error('Failed to start worker', error as Error);
    }
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'worker' });
});

app.listen(PORT, () => {
    logger.info(`Worker service running on port ${PORT}`);
    startWorker();
});


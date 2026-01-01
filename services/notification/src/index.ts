import express from 'express';
import dotenv from 'dotenv';
import { MessagingService } from '@developer-infrastructure/amqp';
import { createLogger } from '@developer-infrastructure/logger';
import { NotificationHandler, NotificationEvent } from './handlers/NotificationHandler.js';
import { MockEmailProvider } from './providers/MockEmailProvider.js';

dotenv.config();

const logger = createLogger({ service: 'notification-service' });
const app = express();
const PORT = process.env.PORT || 3006;

// Dependency Injection: Choose provider here
const emailProvider = new MockEmailProvider();
const notificationHandler = new NotificationHandler(emailProvider);

const messaging = new MessagingService({
    serviceName: 'notification-service',
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    logger,
});

async function startNotificationService() {
    try {
        await messaging.connect();

        // Subscribe to user events for notifications
        await messaging.subscribe<NotificationEvent>(
            'user.events',
            'user.#',
            'notification-service-queue',
            async (event: NotificationEvent) => {
                try {
                    await notificationHandler.handle(event);
                } catch (error) {
                    logger.error(`Error processing notification for ${event.type}:`, error as Error);
                    // In a more advanced setup, we would handle retries here
                }
            }
        );

        logger.info('Notification service is ready and listening for events.');
    } catch (error) {
        logger.error('Failed to start notification service', error as Error);
    }
}

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'notification',
        provider: emailProvider.getName()
    });
});

app.listen(PORT, () => {
    logger.info(`Notification server running on port ${PORT}`);
    startNotificationService();
});

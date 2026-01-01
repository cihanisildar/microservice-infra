import { MessagingService } from '@developer-infrastructure/amqp';
import { logger } from '../middleware/logger.js';
import { config } from '../config/index.js';
import { UserRole } from '@developer-infrastructure/shared-types';

// Define standard exchange names
export const EXCHANGES = {
    USER_EVENTS: 'user.events',
};

// Define standard routing keys
export const ROUTING_KEYS = {
    USER_REGISTERED: 'user.registered',
    USER_LOGGED_IN: 'user.logged_in',
};

/**
 * Interface for User-related events
 */
export interface UserEventPayload {
    userId: string;
    email: string;
    role?: UserRole;
    requestId?: string;
}

class EventBus {
    private messaging: MessagingService;

    constructor() {
        this.messaging = new MessagingService({
            serviceName: config.serviceName,
            url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
            logger: logger,
        });
    }

    async init(): Promise<void> {
        await this.messaging.connect();
    }

    /**
     * Publish a user-related event with type safety
     */
    async publishUserEvent(routingKey: string, data: UserEventPayload, requestId?: string): Promise<void> {
        logger.info(`Publishing event to ${EXCHANGES.USER_EVENTS} [${routingKey}]`, { requestId });

        await this.messaging.publish<UserEventPayload>(EXCHANGES.USER_EVENTS, routingKey, {
            ...data,
            requestId,
        });
    }
}

export const eventBus = new EventBus();

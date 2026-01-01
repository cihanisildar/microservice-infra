import express from 'express';
import dotenv from 'dotenv';
import { MessagingService } from '@developer-infrastructure/amqp';
import { createLogger } from '@developer-infrastructure/logger';
import { auditHandler, GenericEvent } from './audit.handler.js';
import { initDynamoDB } from './db/dynamo.js';
import { initElasticsearch } from './db/elasticsearch.js';

dotenv.config();

const logger = createLogger({ service: 'audit-log-service' });
const app = express();
const PORT = process.env.PORT || 3009;

const messaging = new MessagingService({
    serviceName: 'audit-log-service',
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    logger: logger,
});

console.log(`RabbitMQ URL: ${process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672 (DEFAULT)'}`);
console.log(`Elasticsearch Node: ${process.env.ELASTICSEARCH_NODE || 'http://localhost:9200 (DEFAULT)'}`);
console.log(`DynamoDB Endpoint: ${process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000 (DEFAULT)'}`);

async function startAuditLog() {
    try {
        // Initialize Databases
        await initDynamoDB();
        await initElasticsearch();

        await messaging.connect();

        // [PROFESSIONAL MOVE] Subscribe to EVERYTHING '#' 
        // We use a shared exchange 'user.events' or a broader one if it exists.
        // For now, let's capture all user-related events at least.
        await messaging.subscribe<any>(
            'user.events',
            '#', // THE ULTIMATE WILDCARD: Capture everything on this exchange
            'audit-log-queue',
            async (event: any, msg?: any) => {
                try {
                    // If type is missing, we could try to infer it from routing key
                    // but since our MessagingService doesn't pass msg object yet,
                    // let's just make sure we log something.
                    await auditHandler.handle({
                        type: event.type || 'user.activity', // Fallback
                        data: event,
                        _metadata: event._metadata
                    });
                } catch (err) {
                    logger.error('Failed to audit event:', err as Error);
                }
            }
        );

        logger.info('Audit Log service is now eavesdropping on all events...');

    } catch (error) {
        logger.error('Failed to start audit log service', error as Error);
    }
}

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'audit-log' });
});

app.listen(PORT, () => {
    logger.info(`Audit log server running on port ${PORT}`);
    startAuditLog();
});


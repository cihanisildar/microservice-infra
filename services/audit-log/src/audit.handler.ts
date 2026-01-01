import { createLogger } from '@developer-infrastructure/logger';
import { ddbDocClient, TABLE_NAME } from './db/dynamo.js';
import { esClient, AUDIT_INDEX } from './db/elasticsearch.js';
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

const logger = createLogger({ service: 'audit-handler' });

export interface GenericEvent {
    type: string;
    data: any;
    _metadata?: {
        service: string;
        timestamp: number;
        userId?: string;
    };
}

export class AuditHandler {
    /**
     * Intercepts and persists EVERY event that flows through the system.
     * Dual-write pattern: One for storage (DynamoDB), one for search (Elasticsearch).
     */
    async handle(event: GenericEvent): Promise<void> {
        const timestamp = event._metadata?.timestamp || Date.now();
        const service = event._metadata?.service || 'unknown';
        const eventType = event.type;
        const eventId = uuidv4();

        const auditItem = {
            id: eventId,
            type: eventType,
            service,
            timestamp,
            data: event.data,
            actor: event._metadata?.userId || 'system'
        };

        logger.info(`[AUDIT RECORDING] Event: ${eventType} From: ${service}`);

        // Perform dual writes in parallel for better performance
        const results = await Promise.allSettled([
            this.saveToDynamoDB(auditItem),
            this.saveToElasticsearch(auditItem)
        ]);

        results.forEach((result, index) => {
            const dbName = index === 0 ? 'DynamoDB' : 'Elasticsearch';
            if (result.status === 'fulfilled') {
                logger.debug(`[AUDIT SAVED] Persisted to ${dbName}`);
            } else {
                logger.error(`[AUDIT ERROR] Failed to save to ${dbName}:`, result.reason);
            }
        });
    }

    private async saveToDynamoDB(item: any): Promise<void> {
        await ddbDocClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: item,
            })
        );
    }

    private async saveToElasticsearch(item: any): Promise<void> {
        await esClient.index({
            index: AUDIT_INDEX,
            id: item.id,
            document: item,
        });
    }
}

export const auditHandler = new AuditHandler();

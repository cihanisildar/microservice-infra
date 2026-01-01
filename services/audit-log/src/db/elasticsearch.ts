import { Client } from '@elastic/elasticsearch';
import { createLogger } from '@developer-infrastructure/logger';

const logger = createLogger({ service: 'elasticsearch-client' });

export const esClient = new Client({
    node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200',
});

export const AUDIT_INDEX = 'audit-logs';

/**
 * Initializes Elasticsearch index if it doesn't exist.
 * Professional practice: Creating index with proper mapping for search analytics.
 */
export async function initElasticsearch() {
    try {
        const exists = await esClient.indices.exists({ index: AUDIT_INDEX });

        if (!exists) {
            logger.info(`Creating Elasticsearch index "${AUDIT_INDEX}"...`);
            await esClient.indices.create({
                index: AUDIT_INDEX,
                mappings: {
                    properties: {
                        id: { type: 'keyword' },
                        type: { type: 'keyword' },
                        service: { type: 'keyword' },
                        timestamp: { type: 'date' },
                        actor: { type: 'keyword' },
                        data: { type: 'object' }
                    }
                }
            });
            logger.info(`Index "${AUDIT_INDEX}" created successfully.`);
        } else {
            logger.info(`Elasticsearch index "${AUDIT_INDEX}" already exists.`);
        }
    } catch (error) {
        logger.error('Failed to check/create Elasticsearch index', error as Error);
        // We don't throw here to allow the service to start even if ES is temporarily down
    }
}

import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ScalarAttributeType } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { createLogger } from "@developer-infrastructure/logger";

const logger = createLogger({ service: 'dynamodb-client' });

const client = new DynamoDBClient({
    region: process.env.AWS_REGION || "us-east-1",
    endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
    credentials: {
        accessKeyId: "local",
        secretAccessKey: "local",
    },
});

export const ddbDocClient = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = "AuditLogs";

/**
 * Initializes the DynamoDB table if it doesn't exist.
 * Professional practice: Infra-as-code or auto-init for local dev.
 */
export async function initDynamoDB() {
    try {
        await client.send(new DescribeTableCommand({ TableName: TABLE_NAME }));
        logger.info(`DynamoDB table "${TABLE_NAME}" already exists.`);
    } catch (error: any) {
        if (error.name === "ResourceNotFoundException") {
            logger.info(`Creating DynamoDB table "${TABLE_NAME}"...`);
            await client.send(
                new CreateTableCommand({
                    TableName: TABLE_NAME,
                    AttributeDefinitions: [
                        { AttributeName: "id", AttributeType: "S" },
                        { AttributeName: "timestamp", AttributeType: "N" },
                    ],
                    KeySchema: [
                        { AttributeName: "id", KeyType: "HASH" }, // Partition Key
                        { AttributeName: "timestamp", KeyType: "RANGE" }, // Sort Key
                    ],
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5,
                    },
                })
            );
            logger.info(`Table "${TABLE_NAME}" created successfully.`);
        } else {
            logger.error("Failed to check/create DynamoDB table", error);
            throw error;
        }
    }
}

import { S3Event, Context } from 'aws-lambda';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const s3 = new S3Client({
    endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : undefined,
    region: process.env.AWS_REGION || 'us-east-1',
    forcePathStyle: true,
});

const ddbClient = new DynamoDBClient({
    endpoint: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566` : undefined,
    region: process.env.AWS_REGION || 'us-east-1',
});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

/**
 * Professional Serverless Lambda Handler
 * This function is triggered when a new object is uploaded to an S3 bucket.
 */
export const handler = async (event: S3Event, context: Context) => {
    console.log('Lambda triggered with event:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        const bucket = record.s3.bucket.name;
        const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

        console.log(`Processing file: ${key} from bucket: ${bucket}`);

        try {
            // 1. Get the object from S3
            const response = await s3.send(new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            }));

            // 2. [Professional Simulation] In a real app, we would use 'sharp' or 'jimp' here
            // to resize the image. For this architecture demo, we simulate the process.
            console.log(`Optimizing image: ${key}...`);

            // 3. Log the operation to DynamoDB (Audit Trail)
            await ddbDocClient.send(new PutCommand({
                TableName: 'AuditLogs',
                Item: {
                    id: context.awsRequestId,
                    timestamp: Date.now(),
                    type: 'image.optimized',
                    service: 'lambda-image-optimizer',
                    data: {
                        bucket,
                        key,
                        size: record.s3.object.size,
                    },
                    actor: 'aws-lambda'
                }
            }));

            console.log(`Successfully processed and logged ${key}`);

        } catch (error) {
            console.error(`Error processing ${key} from bucket ${bucket}:`, error);
            throw error;
        }
    }

    return {
        status: 200,
        body: 'Image optimization processed successfully'
    };
};

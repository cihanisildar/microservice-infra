import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";


const endpoint = "http://localhost:4566";
const region = "us-east-1";
const bucketName = "images-bucket";

const s3Client = new S3Client({ endpoint, region, forcePathStyle: true, credentials: { accessKeyId: "test", secretAccessKey: "test" } });
const ddbClient = new DynamoDBClient({ endpoint, region, credentials: { accessKeyId: "test", secretAccessKey: "test" } });

async function runTest() {
    console.log("🧪 Starting Integration Test...");

    try {
        // 1. Upload a file to S3
        const fileName = `test-image-${Date.now()}.jpg`;
        console.log(`Step 1: Uploading "${fileName}" to S3...`);

        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: "fake-image-content",
        }));

        console.log("Upload successful. Waiting for Lambda to wake up and process...");

        // 2. Wait for Lambda processing (Serverless isn't instant in LocalStack sometimes)
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 3. Check DynamoDB for the audit log entry
        console.log("Step 2: Checking DynamoDB for audit record...");
        const result = await ddbClient.send(new ScanCommand({
            TableName: "AuditLogs",
        }));

        const items = result.Items || [];
        const lambdaRecord = items.find(item => item.type?.S === 'image.optimized');

        if (lambdaRecord) {
            console.log("\n🎊 SUCCESS! Lambda successfully processed the image.");
            console.log("Audit Record Details:", JSON.stringify(lambdaRecord, null, 2));
        } else {
            console.log("\n❌ FAIL: Audit record not found. Check LocalStack logs.");
            console.log(`Total records in table: ${items.length}`);
        }

    } catch (error) {
        console.error("\n❌ Test failed with error:", error);
    }
}

runTest();

import { LambdaClient, CreateFunctionCommand, DeleteFunctionCommand, AddPermissionCommand } from "@aws-sdk/client-lambda";
import { S3Client, CreateBucketCommand, PutBucketNotificationConfigurationCommand } from "@aws-sdk/client-s3";
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const region = "us-east-1";
const endpoint = "http://localhost:4566";
const bucketName = "images-bucket";
const functionName = "image-optimizer";

const lambdaClient = new LambdaClient({ endpoint, region, credentials: { accessKeyId: "test", secretAccessKey: "test" } });
const s3Client = new S3Client({ endpoint, region, forcePathStyle: true, credentials: { accessKeyId: "test", secretAccessKey: "test" } });
const ddbClient = new DynamoDBClient({ endpoint, region, credentials: { accessKeyId: "test", secretAccessKey: "test" } });

async function deploy() {
    console.log("🚀 Starting deployment to LocalStack...");

    try {
        // 0. Create DynamoDB Table (for Audit Logs)
        console.log("Step 0: Ensuring DynamoDB table 'AuditLogs' exists...");
        try {
            await ddbClient.send(new DescribeTableCommand({ TableName: "AuditLogs" }));
            console.log("Table 'AuditLogs' already exists.");
        } catch (e) {
            await ddbClient.send(new CreateTableCommand({
                TableName: "AuditLogs",
                AttributeDefinitions: [
                    { AttributeName: "id", AttributeType: "S" },
                    { AttributeName: "timestamp", AttributeType: "N" },
                ],
                KeySchema: [
                    { AttributeName: "id", KeyType: "HASH" },
                    { AttributeName: "timestamp", KeyType: "RANGE" },
                ],
                ProvisionedThroughput: { ReadCapacityUnits: 5, WriteCapacityUnits: 5 }
            }));
            console.log("Table 'AuditLogs' created.");
        }

        // 1. Create S3 Bucket
        console.log(`Step 1: Creating bucket "${bucketName}"...`);
        try {
            await s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        } catch (e: any) {
            if (e.name !== 'BucketAlreadyOwnedByYou' && e.name !== 'BucketAlreadyExists') throw e;
            console.log("Bucket already exists.");
        }

        // 2. Delete existing function if any
        try {
            await lambdaClient.send(new DeleteFunctionCommand({ FunctionName: functionName }));
            console.log("Deleted old function version.");
        } catch (e) { }

        // 3. Create Lambda Function
        console.log(`Step 2: Creating Lambda function "${functionName}"...`);
        const zipPath = join(__dirname, "..", "function.zip");
        console.log(`Reading zip from: ${zipPath}`);
        const zipFile = readFileSync(zipPath);

        const createResult = await lambdaClient.send(new CreateFunctionCommand({
            FunctionName: functionName,
            Runtime: "nodejs20.x",
            Role: "arn:aws:iam::000000000000:role/lambda-role",
            Handler: "index.handler",
            Code: { ZipFile: zipFile },
            Environment: {
                Variables: {
                    LOCALSTACK_HOSTNAME: "localstack", // Internal docker network name
                    AWS_REGION: region
                }
            }
        }));

        const finalFunctionArn = createResult.FunctionArn;
        console.log(`Function created with ARN: ${finalFunctionArn}`);

        // 4. Add Permission for S3 to invoke Lambda
        console.log("Step 3: Adding S3 invocation permission to Lambda...");
        await lambdaClient.send(new AddPermissionCommand({
            FunctionName: functionName,
            StatementId: "s3-trigger-" + Date.now(),
            Action: "lambda:InvokeFunction",
            Principal: "s3.amazonaws.com",
            SourceArn: `arn:aws:s3:::${bucketName}`,
        }));

        // 5. Configure S3 Notification
        console.log("Step 4: Configuring S3 bucket notification (waiting for convergence)...");
        await new Promise(resolve => setTimeout(resolve, 2000));

        await s3Client.send(new PutBucketNotificationConfigurationCommand({
            Bucket: bucketName,
            NotificationConfiguration: {
                LambdaFunctionConfigurations: [
                    {
                        LambdaFunctionArn: finalFunctionArn,
                        Events: ["s3:ObjectCreated:*"],
                    },
                ],
            },
        }));

        console.log("\n✅ Deployment successful!");
        console.log(`You can now upload images to: ${bucketName}`);
        console.log("The Lambda will automatically process them.");

    } catch (error) {
        console.error("\n❌ Deployment failed:", error);
    }
}

deploy();

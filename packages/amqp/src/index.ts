import amqp from 'amqplib';
import Logger from '@developer-infrastructure/logger';

/**
 * Interface for our Messaging Client dependencies.
 * We define exactly what we use to avoid conflicts with wonky library types.
 */
interface AmqpConnection {
    on(event: string, handler: (args: any) => void): void;
    createChannel(): Promise<AmqpChannel>;
    close(): Promise<void>;
}

interface AmqpChannel {
    assertExchange(exchange: string, type: string, options?: any): Promise<any>;
    assertQueue(queue: string, options?: any): Promise<any>;
    bindQueue(queue: string, exchange: string, routingKey: string): Promise<any>;
    publish(exchange: string, routingKey: string, content: Buffer, options?: any): boolean;
    consume(queue: string, onMessage: (msg: any) => void, options?: any): Promise<any>;
    ack(message: any): void;
    nack(message: any, allUpTo?: boolean, requeue?: boolean): void;
    close(): Promise<void>;
}

export interface MessagingOptions {
    serviceName: string;
    url: string;
    reconnectInterval?: number;
    logger?: Logger;
}

export class MessagingService {
    private connection: AmqpConnection | null = null;
    private channel: AmqpChannel | null = null;
    private options: MessagingOptions;
    private logger: Logger;
    private isConnecting: boolean = false;

    constructor(options: MessagingOptions) {
        this.options = {
            reconnectInterval: 5000,
            ...options,
        };
        this.logger = options.logger || (({
            info: console.log,
            error: console.error,
            warn: console.warn,
            debug: console.debug,
        } as unknown) as Logger);
    }

    async connect(): Promise<void> {
        if (this.isConnecting) return;
        this.isConnecting = true;

        try {
            this.logger.info(`Connecting to RabbitMQ at ${this.options.url}...`);
            // The library returns what we need, we just cast it once to our clean interface
            const conn = await amqp.connect(this.options.url) as unknown as AmqpConnection;
            this.connection = conn;

            conn.on('error', (err: Error) => {
                this.logger.error('Connection error', err);
                this.reconnect();
            });

            conn.on('close', () => {
                this.logger.warn('Connection closed. Reconnecting...');
                this.reconnect();
            });

            this.channel = await conn.createChannel();
            this.logger.info(`Connected to RabbitMQ successfully.`);
            this.isConnecting = false;
        } catch (error) {
            this.logger.error('Failed to connect to RabbitMQ', error as Error);
            this.isConnecting = false;
            this.reconnect();
        }
    }

    private reconnect() {
        setTimeout(() => this.connect(), this.options.reconnectInterval);
    }

    async publish<T extends object>(exchange: string, routingKey: string, message: T): Promise<boolean> {
        if (!this.channel) {
            this.logger.error('Cannot publish: Channel not established');
            return false;
        }

        try {
            await this.channel.assertExchange(exchange, 'topic', { durable: true });
            const buffer = Buffer.from(JSON.stringify({
                ...message,
                _metadata: {
                    service: this.options.serviceName,
                    timestamp: Date.now(),
                }
            }));

            return this.channel.publish(exchange, routingKey, buffer, { persistent: true });
        } catch (error) {
            this.logger.error('Publish error', error as Error);
            return false;
        }
    }

    async subscribe<T>(exchange: string, routingKey: string, queueName: string, onMessage: (msg: T) => void): Promise<void> {
        if (!this.channel) {
            throw new Error('Cannot subscribe: Channel not established');
        }

        try {
            await this.channel.assertExchange(exchange, 'topic', { durable: true });
            const q = await this.channel.assertQueue(queueName, { durable: true });

            await this.channel.bindQueue(q.queue, exchange, routingKey);

            this.channel.consume(q.queue, (msg: any) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString()) as T;
                        onMessage(content);
                        this.channel?.ack(msg);
                    } catch (error) {
                        this.logger.error('Error processing message', error as Error);
                        this.channel?.nack(msg, false, false);
                    }
                }
            });

            this.logger.info(`Subscribed to ${routingKey} on ${exchange} via ${queueName}`);
        } catch (error) {
            this.logger.error('Subscription error', error as Error);
            throw error;
        }
    }

    async close(): Promise<void> {
        try {
            await this.channel?.close();
            await this.connection?.close();
        } catch (error) {
            this.logger.error('Error closing connection', error as Error);
        }
    }
}

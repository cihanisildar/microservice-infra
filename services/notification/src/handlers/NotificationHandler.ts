import { createLogger } from '@developer-infrastructure/logger';
import { IEmailProvider } from '../providers/IEmailProvider.js';
import { templateManager } from '../templates/TemplateManager.js';

const logger = createLogger({ service: 'notification-handler' });

export interface NotificationEvent {
    type: string;
    data: any;
}

export class NotificationHandler {
    constructor(private emailProvider: IEmailProvider) { }

    async handle(event: NotificationEvent): Promise<void> {
        switch (event.type) {
            case 'user.registered':
                await this.sendWelcomeEmail(event.data);
                break;
            default:
                logger.debug(`Ignored event type: ${event.type}`);
        }
    }

    private async sendWelcomeEmail(data: any): Promise<void> {
        const { email, userId } = data;

        const template = templateManager.getTemplate('welcome_email');
        if (!template) {
            logger.error('Welcome email template not found');
            return;
        }

        const success = await this.emailProvider.send({
            to: email,
            subject: template.subject,
            body: template.body({ name: email.split('@')[0], userId }),
        });

        if (success) {
            logger.info(`Welcome email sent successfully to ${email}`);
        } else {
            logger.error(`Failed to send welcome email to ${email}`);
            // Here you could throw an error to trigger RabbitMQ retry
        }
    }
}

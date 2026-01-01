import { IEmailProvider, EmailOptions } from './IEmailProvider.js';
import { createLogger } from '@developer-infrastructure/logger';

const logger = createLogger({ service: 'mock-email-provider' });

export class MockEmailProvider implements IEmailProvider {
    async send(options: EmailOptions): Promise<boolean> {
        logger.info(`[MOCK EMAIL] Sending email to: ${options.to}`);
        logger.info(`[MOCK EMAIL] Subject: ${options.subject}`);
        logger.debug(`[MOCK EMAIL] Body: ${options.body}`);

        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return true;
    }

    getName(): string {
        return 'MockEmailProvider';
    }
}

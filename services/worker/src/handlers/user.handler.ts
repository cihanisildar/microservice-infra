import { createLogger } from '@developer-infrastructure/logger';

const logger = createLogger({ service: 'user-handler' });

export interface UserEvent {
    type: string;
    data: {
        email: string;
        userId: string;
        role?: string;
    };
    _metadata?: {
        service: string;
        timestamp: number;
    };
}

export class UserHandler {
    /**
     * Handles all user-related events
     */
    async handle(event: UserEvent): Promise<void> {
        switch (event.type) {
            case 'user.registered':
                await this.onUserRegistered(event);
                break;
            case 'user.updated':
                await this.onUserUpdated(event);
                break;
            default:
                logger.warn(`Unhandled user event type: ${event.type}`);
        }
    }

    private async onUserRegistered(event: UserEvent): Promise<void> {
        logger.info(`[UserHandler] Processing registration for: ${event.data.email}`);

        // Bu noktada gerçek iş mantığı gelecek:
        // - Hoş geldin e-postası gönder
        // - Varsayılan profil ayarlarını oluştur
        // - Analitik servisine haber ver (gerekirse başka bir event fırlatarak)

        // Simülasyon:
        await new Promise(resolve => setTimeout(resolve, 500));
        logger.info(`[UserHandler] Successfully processed registration for ${event.data.userId}`);
    }

    private async onUserUpdated(event: UserEvent): Promise<void> {
        logger.info(`[UserHandler] Processing update for: ${event.data.userId}`);
        // Profil güncelleme sonrası işlemler...
    }
}

export const userHandler = new UserHandler();

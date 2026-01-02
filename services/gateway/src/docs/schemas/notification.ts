import { registry } from '../registry.js';
import {
    NotificationSchema,
    NotificationListSchema
} from '@developer-infrastructure/shared-types';

export const Notification = registry.register('Notification', NotificationSchema);
export const NotificationList = registry.register('NotificationList', NotificationListSchema);

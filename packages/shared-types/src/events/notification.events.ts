/**
 * Notification Domain Events
 */
export const NotificationEvents = {
    SENT: 'notification.sent',
    FAILED: 'notification.failed',
    SCHEDULED: 'notification.scheduled',
} as const;

export type NotificationEventType = typeof NotificationEvents[keyof typeof NotificationEvents];

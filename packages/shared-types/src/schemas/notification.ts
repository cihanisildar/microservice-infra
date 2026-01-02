import { z } from 'zod';

export const NotificationSchema = z.object({
    id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    type: z.enum(['email', 'sms', 'push']).openapi({ example: 'email' }),
    recipient: z.string().openapi({ example: 'john@example.com' }),
    status: z.enum(['pending', 'sent', 'failed']).openapi({ example: 'sent' }),
    title: z.string().openapi({ example: 'Welcome!' }),
    content: z.string().openapi({ example: 'Thanks for signing up.' }),
    createdAt: z.number().openapi({ example: 1704100000000 }),
}).openapi('Notification');

export const NotificationListSchema = z.object({
    items: z.array(NotificationSchema),
    total: z.number().openapi({ example: 50 }),
}).openapi('NotificationList');

export type Notification = z.infer<typeof NotificationSchema>;
export type NotificationList = z.infer<typeof NotificationListSchema>;

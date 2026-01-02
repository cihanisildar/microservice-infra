import { z } from 'zod';

export const AuditLogSchema = z.object({
    id: z.string().uuid().openapi({ example: '550e8400-e29b-41d4-a716-446655440000' }),
    userId: z.string().openapi({ example: 'user-123' }),
    action: z.string().openapi({ example: 'user.login' }),
    resource: z.string().openapi({ example: 'auth-service' }),
    details: z.record(z.string(), z.any()).optional().openapi({ example: { ip: '127.0.0.1' } }),
    timestamp: z.number().openapi({ example: 1704100000000 }),
}).openapi('AuditLog');

export const AuditLogListSchema = z.object({
    items: z.array(AuditLogSchema),
    total: z.number().openapi({ example: 100 }),
}).openapi('AuditLogList');

export type AuditLog = z.infer<typeof AuditLogSchema>;
export type AuditLogList = z.infer<typeof AuditLogListSchema>;

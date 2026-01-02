import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

extendZodWithOpenApi(z);

export const HealthCheckSchema = z.object({
    name: z.string().openapi({ example: 'auth-service' }),
    status: z.enum(['pass', 'fail']).openapi({ example: 'pass' }),
    responseTime: z.number().optional().openapi({ example: 45 }),
    message: z.string().openapi({ example: 'OK' }),
}).openapi('HealthCheck');

export const HealthStatusSchema = z.object({
    status: z.enum(['healthy', 'degraded', 'unhealthy']).openapi({ example: 'healthy' }),
    service: z.string().openapi({ example: 'gateway' }),
    version: z.string().openapi({ example: '1.0.0' }),
    timestamp: z.number().openapi({ example: 1704100000000 }),
    checks: z.array(HealthCheckSchema).optional(),
}).openapi('HealthStatus');

export const ErrorSchema = z.object({
    code: z.string().openapi({ example: 'INTERNAL_ERROR' }),
    message: z.string().openapi({ example: 'An unexpected error occurred' }),
    field: z.string().optional().openapi({ example: 'email' }),
    details: z.record(z.string(), z.any()).optional().openapi({ example: { reason: 'already exists' } }),
    requestId: z.string().optional().openapi({ example: 'req-123' }),
}).openapi('Error');

export type HealthCheck = z.infer<typeof HealthCheckSchema>;
export type HealthStatus = z.infer<typeof HealthStatusSchema>;
export type ErrorResponse = z.infer<typeof ErrorSchema>;

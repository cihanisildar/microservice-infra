import { Router, Request, Response } from 'express';
import { HealthStatus, HealthCheck } from '@developer-infrastructure/shared-types';
import { config } from '../config/index.js';

const router = Router();

/**
 * Basic health check
 */
router.get('/health', (req: Request, res: Response) => {
    const health: HealthStatus = {
        status: 'healthy',
        service: config.serviceName,
        version: '1.0.0',
        timestamp: Date.now(),
    };

    res.json(health);
});

/**
 * Detailed health check with service dependencies
 */
router.get('/health/detailed', async (req: Request, res: Response) => {
    const checks: HealthCheck[] = [];

    // Check each service
    for (const [name, url] of Object.entries(config.services)) {
        const startTime = Date.now();
        try {
            const response = await fetch(`${url}/health`, {
                signal: AbortSignal.timeout(5000), // 5 second timeout
            });

            checks.push({
                name,
                status: response.ok ? 'pass' : 'fail',
                responseTime: Date.now() - startTime,
                message: response.ok ? 'OK' : `HTTP ${response.status}`,
            });
        } catch (error) {
            checks.push({
                name,
                status: 'fail',
                responseTime: Date.now() - startTime,
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    const allHealthy = checks.every((check) => check.status === 'pass');
    const someHealthy = checks.some((check) => check.status === 'pass');

    const health: HealthStatus = {
        status: allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'unhealthy',
        service: config.serviceName,
        version: '1.0.0',
        timestamp: Date.now(),
        checks,
    };

    const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(health);
});

/**
 * Metrics endpoint
 */
router.get('/metrics', (req: Request, res: Response) => {
    // TODO: Implement Prometheus metrics
    res.json({
        service: config.serviceName,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: Date.now(),
    });
});

export default router;

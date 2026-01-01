import { Request, Response, NextFunction } from 'express';
import { createLogger, LogLevel } from '@developer-infrastructure/logger';
import { getRequestId, getRequestDuration } from '@developer-infrastructure/shared-types';

const logger = createLogger({
    service: 'gateway',
    level: LogLevel.INFO,
    enableConsole: true,
    enableFile: true,
    logDir: './logs'
});

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const requestId = getRequestId(req);

    logger.info(`${req.method} ${req.path}`, {
        requestId,
        method: req.method,
        path: req.path,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    });

    // Log response
    res.on('finish', () => {
        const duration = getRequestDuration(req);

        logger.logRequest(
            req.method,
            req.path,
            res.statusCode,
            duration,
            { requestId }
        );
    });

    next();
};

export { logger };

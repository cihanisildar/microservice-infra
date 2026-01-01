import { Request, Response, NextFunction } from 'express';
import { createLogger } from '@developer-infrastructure/logger';
import { config } from '../config/index.js';

export const logger = createLogger({
    service: config.serviceName,
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`, {
        requestId: req.requestId,
        ip: req.ip,
    });
    next();
};

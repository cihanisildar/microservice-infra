import { Request, Response, NextFunction } from 'express';
import {
    formatError,
    isOperationalError,
    AppError,
    HttpStatus,
} from '@developer-infrastructure/shared-types';
import { logger } from './logger.js';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    logger.error(err.message, err, {
        requestId: req.requestId,
        path: req.path,
        method: req.method,
    });

    if (!isOperationalError(err)) {
        logger.error('Non-operational error occurred', err);
        // In production, we might want to shut down here
    }

    const errorResponse = formatError(err);
    const statusCode = err instanceof AppError ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;

    res.status(statusCode).json({
        success: false,
        error: errorResponse,
        meta: {
            requestId: req.requestId,
            timestamp: Date.now(),
        },
    });
};

export const notFoundHandler = (req: Request, res: Response) => {
    res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.path} not found`,
        },
        meta: {
            requestId: req.requestId,
            timestamp: Date.now(),
        },
    });
};

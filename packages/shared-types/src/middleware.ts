import { randomUUID } from 'crypto';
import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Request {
            requestId?: string;
            startTime?: number;
        }
    }
}

/**
 * Generate or extract request ID from headers
 */
export const extractRequestId = (req: Request): string => {
    const headerRequestId = req.headers['x-request-id'] as string;
    return headerRequestId || randomUUID();
};

/**
 * Request ID middleware
 * Adds a unique request ID to each request for tracking across services
 */
export const requestIdMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const requestId = extractRequestId(req);

        // Attach to request object
        req.requestId = requestId;
        req.startTime = Date.now();

        // Add to response headers
        res.setHeader('X-Request-ID', requestId);

        next();
    };
};

/**
 * Get current request ID from request
 */
export const getRequestId = (req: Request): string | undefined => {
    return req.requestId;
};

/**
 * Request duration calculator
 */
export const getRequestDuration = (req: Request): number => {
    if (!req.startTime) {
        return 0;
    }
    return Date.now() - req.startTime;
};

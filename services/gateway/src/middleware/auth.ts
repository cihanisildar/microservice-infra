import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
    UnauthorizedError,
    UserRole,
    UserPayload
} from '@developer-infrastructure/shared-types';
import { config } from '../config/index.js';

/**
 * Extend Express Request to include user identity
 */
export interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

/**
 * Auth middleware - validates JWT tokens
 * This is the Gatekeeper of the entire microservice ecosystem.
 */
export const authMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedError('Missing or invalid authorization header');
        }

        const token = authHeader.substring(7);

        try {
            // Verify token signature and expiration
            const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;

            // Set user on request for local gateway use
            req.user = decoded;

            // [ELITE MOVE] Identity Injection
            // We propagate the verified identity to downstream microservices via headers.
            // This ensures services don't need to re-verify the JWT signature.
            req.headers['x-user-id'] = decoded.sub;
            req.headers['x-user-role'] = decoded.role;
            req.headers['x-user-email'] = decoded.email;

            next();
        } catch (err) {
            // jwt.verify throws error for expired or invalid tokens
            throw new UnauthorizedError('Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Optional auth middleware - passes through if no token is found
 */
export const optionalAuthMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            try {
                const decoded = jwt.verify(token, config.jwt.secret) as UserPayload;
                req.user = decoded;

                // Still inject headers if token is present
                req.headers['x-user-id'] = decoded.sub;
                req.headers['x-user-role'] = decoded.role;
                req.headers['x-user-email'] = decoded.email;
            } catch (err) {
                // Ignore invalid tokens for optional auth routes
            }
        }

        next();
    } catch (error) {
        next();
    }
};

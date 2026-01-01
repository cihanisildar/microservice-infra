import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, UserRole } from '@developer-infrastructure/shared-types';
import { config } from '../config/index.js';

interface JwtPayload {
    sub: string;
    email: string;
    role: UserRole;
}

/**
 * Extend Express Request to include user identity
 */
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

/**
 * Auth middleware - validates JWT tokens
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
            const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
            req.user = decoded;

            // Professionally, we inject user identity into headers for downstream services
            // This way they don't ALL need to verify the JWT
            req.headers['x-user-id'] = decoded.sub;
            req.headers['x-user-role'] = decoded.role;
            req.headers['x-user-email'] = decoded.email;

            next();
        } catch (err) {
            throw new UnauthorizedError('Invalid or expired token');
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Optional auth middleware - doesn't fail if no token
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
                const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
                req.user = decoded;
                req.headers['x-user-id'] = decoded.sub;
                req.headers['x-user-role'] = decoded.role;
                req.headers['x-user-email'] = decoded.email;
            } catch (err) {
                // Ignore invalid tokens for optional auth
            }
        }

        next();
    } catch (error) {
        next();
    }
};

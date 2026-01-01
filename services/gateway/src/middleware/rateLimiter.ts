import rateLimit from 'express-rate-limit';
import { RateLimitError } from '@developer-infrastructure/shared-types';
import { config } from '../config/index.js';

/**
 * Global rate limiter
 */
export const globalRateLimiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new RateLimitError('Too many requests, please try again later');
    },
    skip: (req) => {
        // Skip rate limiting for health checks
        return req.path === '/health';
    },
});

/**
 * Strict rate limiter for auth endpoints
 */
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        throw new RateLimitError('Too many authentication attempts');
    },
});

/**
 * API rate limiter - per API key
 */
export const apiRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // 60 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        // Use API key if present, otherwise IP
        return req.headers['x-api-key'] as string || req.ip || 'unknown';
    },
    handler: (req, res) => {
        throw new RateLimitError('API rate limit exceeded');
    },
});

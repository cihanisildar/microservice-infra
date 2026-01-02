import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import { ApiTag } from '@developer-infrastructure/shared-types';

const router = Router();

const authProxy = createProxyMiddleware({
    target: config.services.auth,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/auth': '',
    },
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth, Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Invalid input
 */
router.post('/register', authRateLimiter, authProxy);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Auth, Public]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authRateLimiter, authProxy);

export default router;

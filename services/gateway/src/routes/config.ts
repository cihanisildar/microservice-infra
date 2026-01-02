import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { ApiTag } from '@developer-infrastructure/shared-types';

const router = Router();

const configProxy = createProxyMiddleware({
    target: config.services.config,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/config': '',
    },
});

/**
 * @openapi
 * /config:
 *   get:
 *     summary: Get all configurations
 *     description: Retrieve system settings. Restricted to admin.
 *     tags: [Configuration, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuration list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConfigList'
 */
router.get('/', authMiddleware, configProxy);

/**
 * @openapi
 * /config:
 *   post:
 *     summary: Update configuration
 *     tags: [Configuration, Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Config'
 *     responses:
 *       200:
 *         description: Configuration updated
 */
router.post('/', authMiddleware, configProxy);

export default router;

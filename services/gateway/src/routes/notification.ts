import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { ApiTag } from '@developer-infrastructure/shared-types';

const router = Router();

const notificationProxy = createProxyMiddleware({
    target: config.services.notification,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/notifications': '',
    },
});

/**
 * @openapi
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notification, Public]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationList'
 *       401:
 *         description: Unauthorized
 */
router.get('/', authMiddleware, notificationProxy);

export default router;

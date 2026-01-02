import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { authMiddleware } from '../middleware/auth.js';
import { ApiTag } from '@developer-infrastructure/shared-types';

const router = Router();

// Only internal/admin should usually access all audit logs
const auditProxy = createProxyMiddleware({
    target: config.services.auditLog,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/audit-logs': '',
    },
});

/**
 * @openapi
 * /audit-logs:
 *   get:
 *     summary: Retrieve audit logs
 *     description: Returns a list of system audit logs. Requires admin privileges.
 *     tags: [Audit, Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of audit logs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuditLogList'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get('/', authMiddleware, auditProxy);

export default router;

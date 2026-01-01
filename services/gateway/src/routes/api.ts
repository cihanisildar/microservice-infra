import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { AuthenticatedRequest, authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Auth routes - with strict rate limiting
router.use(
    '/auth',
    authRateLimiter,
    createProxyMiddleware({
        target: config.services.auth,
        changeOrigin: true,
        pathRewrite: {
            '^/api/v1/auth': '', // Remove /api/v1/auth prefix
        },
        onProxyReq: (proxyReq, req: AuthenticatedRequest) => {
            if (req.requestId) {
                proxyReq.setHeader('X-Request-ID', req.requestId);
            }
            // Forward user identity if authenticated
            if (req.user) {
                proxyReq.setHeader('X-User-ID', req.user.sub);
                proxyReq.setHeader('X-User-Role', req.user.role);
                proxyReq.setHeader('X-User-Email', req.user.email);
            }
        },
    })
);

// Audit log routes - requires auth
router.use(
    '/audit-logs',
    authMiddleware,
    createProxyMiddleware({
        target: config.services.auditLog,
        changeOrigin: true,
        pathRewrite: {
            '^/api/v1/audit-logs': '',
        },
        onProxyReq: (proxyReq, req) => {
            if (req.requestId) {
                proxyReq.setHeader('X-Request-ID', req.requestId);
            }
        },
    })
);

// Config routes - requires auth
router.use(
    '/config',
    authMiddleware,
    createProxyMiddleware({
        target: config.services.config,
        changeOrigin: true,
        pathRewrite: {
            '^/api/v1/config': '',
        },
        onProxyReq: (proxyReq, req) => {
            if (req.requestId) {
                proxyReq.setHeader('X-Request-ID', req.requestId);
            }
        },
    })
);

// Feature flags routes - optional auth
router.use(
    '/feature-flags',
    optionalAuthMiddleware,
    createProxyMiddleware({
        target: config.services.featureFlags,
        changeOrigin: true,
        pathRewrite: {
            '^/api/v1/feature-flags': '',
        },
        onProxyReq: (proxyReq, req) => {
            if (req.requestId) {
                proxyReq.setHeader('X-Request-ID', req.requestId);
            }
        },
    })
);

// Notification routes - requires auth
router.use(
    '/notifications',
    authMiddleware,
    createProxyMiddleware({
        target: config.services.notification,
        changeOrigin: true,
        pathRewrite: {
            '^/api/v1/notifications': '',
        },
        onProxyReq: (proxyReq, req) => {
            if (req.requestId) {
                proxyReq.setHeader('X-Request-ID', req.requestId);
            }
        },
    })
);

export default router;

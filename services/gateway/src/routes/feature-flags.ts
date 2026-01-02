import { Router } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { config } from '../config/index.js';
import { optionalAuthMiddleware } from '../middleware/auth.js';
import { ApiTag } from '@developer-infrastructure/shared-types';

const router = Router();

const featureFlagsProxy = createProxyMiddleware({
    target: config.services.featureFlags,
    changeOrigin: true,
    pathRewrite: {
        '^/api/v1/feature-flags': '',
    },
});

/**
 * @openapi
 * /feature-flags:
 *   get:
 *     summary: List all feature flags
 *     tags: [FeatureFlags, Public]
 *     responses:
 *       200:
 *         description: Feature flags list
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeatureFlagList'
 */
router.get('/', optionalAuthMiddleware, featureFlagsProxy);

export default router;

import { Router } from 'express';
import authRoutes from './auth.js';
import auditRoutes from './audit.js';
import notificationRoutes from './notification.js';
import configRoutes from './config.js';
import featureFlagRoutes from './feature-flags.js';

const router = Router();

// Domain Routes
router.use('/auth', authRoutes);
router.use('/audit-logs', auditRoutes);
router.use('/notifications', notificationRoutes);
router.use('/config', configRoutes);
router.use('/feature-flags', featureFlagRoutes);

export default router;

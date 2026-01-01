import { Router } from 'express';
import { z } from 'zod';
import * as authController from '../controllers/auth.js';
import { validate } from '../middleware/validate.js';
import { UserRole } from '@developer-infrastructure/shared-types';

const router = Router();

const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        role: z.nativeEnum(UserRole).optional(),
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

export default router;

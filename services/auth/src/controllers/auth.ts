import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    UnauthorizedError,
    ValidationError,
    UserRole,
    BaseEntity
} from '@developer-infrastructure/shared-types';
import { config } from '../config/index.js';
import { eventBus, ROUTING_KEYS } from '../services/eventBus.js';

/**
 * User interface representing the data structure
 */
interface User extends BaseEntity {
    email: string;
    password: string;
    role: UserRole;
}

/**
 * Response structure for authentication
 */
interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: UserRole;
    };
    token: string;
}

// In-memory mock database with proper typing
const users: User[] = [];

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, role = UserRole.USER } = req.body;

        const existingUser = users.find(u => u.email === email);
        if (existingUser) {
            throw new ValidationError('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);

        const now = new Date();
        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            password: hashedPassword,
            role,
            createdAt: now,
            updatedAt: now,
        };

        users.push(newUser);

        // Emit 'user.registered' event
        await eventBus.publishUserEvent(ROUTING_KEYS.USER_REGISTERED, {
            userId: newUser.id,
            email: newUser.email,
            role: newUser.role
        }, req.requestId);

        const token = jwt.sign(
            { sub: newUser.id, email: newUser.email, role: newUser.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn as any }
        );

        const response: AuthResponse = {
            user: {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
            },
            token
        };

        res.status(201).json({
            success: true,
            data: response
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = users.find(u => u.email === email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        const token = jwt.sign(
            { sub: user.id, email: user.email, role: user.role },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn as any }
        );

        // Emit 'user.logged_in' event for audit logs
        await eventBus.publishUserEvent(ROUTING_KEYS.USER_LOGGED_IN, {
            userId: user.id,
            email: user.email
        }, req.requestId);

        const response: AuthResponse = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        };

        res.json({
            success: true,
            data: response
        });
    } catch (error) {
        next(error);
    }
};

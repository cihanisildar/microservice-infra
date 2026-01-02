import { ErrorResponse } from './schemas/common.js';
export * from './schemas/common.js';
export * from './schemas/auth.js';
export * from './schemas/audit.js';
export * from './schemas/notification.js';
export * from './schemas/config.js';
export * from './schemas/feature-flags.js';

/**
 * Base response interface for all API responses
 */
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: ErrorResponse;
    meta?: ResponseMeta;
}

/**
 * Response metadata
 */
export interface ResponseMeta {
    requestId: string;
    timestamp: number;
    pagination?: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * Base entity interface
 */
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * User roles
 */
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    SERVICE = 'service',
}

/**
 * Request context passed between services
 */
export interface RequestContext {
    requestId: string;
    userId?: string;
    userRole?: UserRole;
    timestamp: number;
    source?: string;
}

// Export internal modules
export * from './enums.js';
export * from './errors.js';
export * from './middleware.js';
export * from './config.js';

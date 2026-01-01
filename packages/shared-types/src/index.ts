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
 * Error response structure
 */
export interface ErrorResponse {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, any>;
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
 * Service health status
 */
export interface HealthStatus {
    status: 'healthy' | 'degraded' | 'unhealthy';
    service: string;
    version: string;
    timestamp: number;
    checks?: HealthCheck[];
}

/**
 * Individual health check
 */
export interface HealthCheck {
    name: string;
    status: 'pass' | 'fail';
    message?: string;
    responseTime?: number;
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

// Export enums
export * from './enums.js';

// Export errors
export * from './errors.js';

// Export middleware
export * from './middleware.js';

// Export config utilities
export * from './config.js';

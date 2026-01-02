import { ErrorResponse } from './schemas/common.js';
import { UserRole } from './enums.js';

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
 * Request context passed between services
 */
export interface RequestContext {
    requestId: string;
    userId?: string;
    userRole?: UserRole;
    timestamp: number;
    source?: string;
}

/**
 * HTTP Status codes
 */
export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500,
    BAD_GATEWAY = 502,
    SERVICE_UNAVAILABLE = 503,
}

/**
 * Error codes
 */
export enum ErrorCode {
    // Validation errors
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INVALID_INPUT = 'INVALID_INPUT',
    MISSING_FIELD = 'MISSING_FIELD',

    // Authentication/Authorization
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    INVALID_TOKEN = 'INVALID_TOKEN',
    TOKEN_EXPIRED = 'TOKEN_EXPIRED',

    // Resource errors
    NOT_FOUND = 'NOT_FOUND',
    ALREADY_EXISTS = 'ALREADY_EXISTS',
    CONFLICT = 'CONFLICT',

    // Rate limiting
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

    // Server errors
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Event types for event bus
 */
export enum EventType {
    USER_CREATED = 'user.created',
    USER_UPDATED = 'user.updated',
    USER_DELETED = 'user.deleted',

    AUDIT_LOG_CREATED = 'audit.log.created',

    NOTIFICATION_SENT = 'notification.sent',
    NOTIFICATION_FAILED = 'notification.failed',
}

/**
 * API Documentation Tags
 */
export enum ApiTag {
    PUBLIC = 'Public',
    ADMIN = 'Admin',
    INTERNAL = 'Internal',
}

/**
 * Event payload structure
 */
export interface EventPayload<T = any> {
    type: EventType;
    data: T;
    metadata: {
        requestId: string;
        timestamp: number;
        source: string;
    };
}

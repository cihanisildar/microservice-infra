import { ErrorCode, HttpStatus } from './enums.js';

/**
 * Base application error class
 */
export class AppError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: HttpStatus;
    public readonly isOperational: boolean;
    public readonly field?: string;
    public readonly details?: Record<string, any>;

    constructor(
        message: string,
        code: ErrorCode = ErrorCode.INTERNAL_ERROR,
        statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
        isOperational = true,
        field?: string,
        details?: Record<string, any>
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = code;
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.field = field;
        this.details = details;

        Error.captureStackTrace(this);
    }
}

/**
 * Validation error
 */
export class ValidationError extends AppError {
    constructor(message: string, field?: string, details?: Record<string, any>) {
        super(message, ErrorCode.VALIDATION_ERROR, HttpStatus.BAD_REQUEST, true, field, details);
    }
}

/**
 * Authentication error
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(message, ErrorCode.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }
}

/**
 * Authorization error
 */
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(message, ErrorCode.FORBIDDEN, HttpStatus.FORBIDDEN);
    }
}

/**
 * Not found error
 */
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, ErrorCode.NOT_FOUND, HttpStatus.NOT_FOUND);
    }
}

/**
 * Conflict error
 */
export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, ErrorCode.CONFLICT, HttpStatus.CONFLICT);
    }
}

/**
 * Rate limit exceeded error
 */
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests') {
        super(message, ErrorCode.RATE_LIMIT_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS);
    }
}

/**
 * External service error
 */
export class ExternalServiceError extends AppError {
    constructor(message: string, service: string) {
        super(
            message,
            ErrorCode.EXTERNAL_SERVICE_ERROR,
            HttpStatus.BAD_GATEWAY,
            true,
            undefined,
            { service }
        );
    }
}

/**
 * Check if error is operational (expected) or programming error
 */
export const isOperationalError = (error: Error): boolean => {
    if (error instanceof AppError) {
        return error.isOperational;
    }
    return false;
};

/**
 * Format error for API response
 */
export const formatError = (error: Error) => {
    if (error instanceof AppError) {
        return {
            code: error.code,
            message: error.message,
            field: error.field,
            details: error.details,
        };
    }

    return {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
    };
};

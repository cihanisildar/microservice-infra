import { config as dotenvConfig } from 'dotenv';
import { resolve } from 'path';

/**
 * Load environment variables
 */
export const loadEnv = (envFile?: string): void => {
    const envPath = envFile || `.env.${process.env.NODE_ENV || 'local'}`;
    dotenvConfig({ path: resolve(process.cwd(), envPath) });
};

/**
 * Get required environment variable or throw error
 */
export const getRequiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
};

/**
 * Get optional environment variable with default value
 */
export const getEnv = (key: string, defaultValue = ''): string => {
    return process.env[key] || defaultValue;
};

/**
 * Get environment variable as number
 */
export const getEnvAsNumber = (key: string, defaultValue: number): number => {
    const value = process.env[key];
    if (!value) return defaultValue;

    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
        throw new Error(`Environment variable ${key} must be a number, got: ${value}`);
    }
    return parsed;
};

/**
 * Get environment variable as boolean
 */
export const getEnvAsBoolean = (key: string, defaultValue = false): boolean => {
    const value = process.env[key];
    if (!value) return defaultValue;

    return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Validate required environment variables
 */
export const validateEnv = (requiredVars: string[]): void => {
    const missing = requiredVars.filter((varName) => !process.env[varName]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missing.join(', ')}`
        );
    }
};

/**
 * Base configuration interface
 */
export interface BaseConfig {
    env: string;
    port: number;
    serviceName: string;
    logLevel: string;
}

/**
 * Create base configuration
 */
export const createBaseConfig = (serviceName: string): BaseConfig => {
    return {
        env: getEnv('NODE_ENV', 'development'),
        port: getEnvAsNumber('PORT', 3000),
        serviceName,
        logLevel: getEnv('LOG_LEVEL', 'info'),
    };
};

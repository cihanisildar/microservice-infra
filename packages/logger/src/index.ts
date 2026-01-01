import winston from 'winston';

export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
}

export interface LoggerOptions {
    service: string;
    level?: LogLevel;
    enableConsole?: boolean;
    enableFile?: boolean;
    logDir?: string;
}

export interface LogMetadata {
    requestId?: string;
    userId?: string;
    [key: string]: any;
}

class Logger {
    private logger: winston.Logger;
    private service: string;

    constructor(options: LoggerOptions) {
        this.service = options.service;

        const transports: winston.transport[] = [];

        // Console transport
        if (options.enableConsole !== false) {
            transports.push(
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.timestamp(),
                        winston.format.printf(({ timestamp, level, message, ...meta }) => {
                            const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
                            return `${timestamp} [${this.service}] ${level}: ${message} ${metaString}`;
                        })
                    ),
                })
            );
        }

        // File transport
        if (options.enableFile) {
            const logDir = options.logDir || './logs';
            transports.push(
                new winston.transports.File({
                    filename: `${logDir}/error.log`,
                    level: 'error',
                    format: winston.format.json(),
                }),
                new winston.transports.File({
                    filename: `${logDir}/combined.log`,
                    format: winston.format.json(),
                })
            );
        }

        this.logger = winston.createLogger({
            level: options.level || LogLevel.INFO,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.json()
            ),
            defaultMeta: { service: this.service },
            transports,
        });
    }

    private log(level: LogLevel, message: string, meta?: LogMetadata) {
        this.logger.log(level, message, meta);
    }

    info(message: string, meta?: LogMetadata) {
        this.log(LogLevel.INFO, message, meta);
    }

    error(message: string, error?: Error, meta?: LogMetadata) {
        this.log(LogLevel.ERROR, message, {
            ...meta,
            error: error
                ? {
                    message: error.message,
                    stack: error.stack,
                    name: error.name,
                }
                : undefined,
        });
    }

    warn(message: string, meta?: LogMetadata) {
        this.log(LogLevel.WARN, message, meta);
    }

    debug(message: string, meta?: LogMetadata) {
        this.log(LogLevel.DEBUG, message, meta);
    }

    // HTTP request logging
    logRequest(method: string, path: string, statusCode: number, duration: number, meta?: LogMetadata) {
        this.info(`${method} ${path} ${statusCode} - ${duration}ms`, meta);
    }
}

export const createLogger = (options: LoggerOptions): Logger => {
    return new Logger(options);
};

export default Logger;

import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Zod validation middleware for Express
 */
export const validateRequest = (schema: {
    body?: z.ZodSchema;
    query?: z.ZodSchema;
    params?: z.ZodSchema;
}) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                req.body = await schema.body.parseAsync(req.body);
            }
            if (schema.query) {
                req.query = await schema.query.parseAsync(req.query) as any;
            }
            if (schema.params) {
                req.params = await schema.params.parseAsync(req.params) as any;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Invalid request data',
                        details: error.flatten().fieldErrors,
                        requestId: (req as any).requestId
                    }
                });
            }
            next(error);
        }
    };
};

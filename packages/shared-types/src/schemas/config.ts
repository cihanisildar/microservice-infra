import { z } from 'zod';

export const ConfigSchema = z.object({
    key: z.string().openapi({ example: 'app.name' }),
    value: z.any().openapi({ example: 'My Awesome App' }),
    description: z.string().optional().openapi({ example: 'The display name of the application' }),
    updatedAt: z.number().openapi({ example: 1704100000000 }),
}).openapi('Config');

export const ConfigListSchema = z.object({
    items: z.array(ConfigSchema),
}).openapi('ConfigList');

export type Config = z.infer<typeof ConfigSchema>;
export type ConfigList = z.infer<typeof ConfigListSchema>;

import { z } from 'zod';

export const FeatureFlagSchema = z.object({
    name: z.string().openapi({ example: 'new_landing_page' }),
    enabled: z.boolean().openapi({ example: true }),
    rules: z.record(z.string(), z.any()).optional().openapi({ example: { percentage: 50 } }),
    description: z.string().optional().openapi({ example: 'Enable the new hero section' }),
}).openapi('FeatureFlag');

export const FeatureFlagListSchema = z.object({
    items: z.array(FeatureFlagSchema),
}).openapi('FeatureFlagList');

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;
export type FeatureFlagList = z.infer<typeof FeatureFlagListSchema>;

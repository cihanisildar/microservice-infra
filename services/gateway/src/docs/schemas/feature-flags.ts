import { registry } from '../registry.js';
import {
    FeatureFlagSchema,
    FeatureFlagListSchema
} from '@developer-infrastructure/shared-types';

export const FeatureFlag = registry.register('FeatureFlag', FeatureFlagSchema);
export const FeatureFlagList = registry.register('FeatureFlagList', FeatureFlagListSchema);

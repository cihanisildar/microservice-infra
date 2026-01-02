import { registry } from '../registry.js';
import {
    ConfigSchema,
    ConfigListSchema
} from '@developer-infrastructure/shared-types';

export const Config = registry.register('Config', ConfigSchema);
export const ConfigList = registry.register('ConfigList', ConfigListSchema);

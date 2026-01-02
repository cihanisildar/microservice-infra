import { registry } from '../registry.js';
import {
    HealthCheckSchema,
    HealthStatusSchema,
    ErrorSchema
} from '@developer-infrastructure/shared-types';

// Register schemas to the local gateway registry (for OpenAPI generation)
registry.register('HealthCheck', HealthCheckSchema);
registry.register('HealthStatus', HealthStatusSchema);
registry.register('Error', ErrorSchema);

// Export types for use in the application
export type { HealthCheck, HealthStatus, ErrorResponse } from '@developer-infrastructure/shared-types';

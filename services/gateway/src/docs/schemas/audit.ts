import { registry } from '../registry.js';
import {
    AuditLogSchema,
    AuditLogListSchema
} from '@developer-infrastructure/shared-types';

export const AuditLog = registry.register('AuditLog', AuditLogSchema);
export const AuditLogList = registry.register('AuditLogList', AuditLogListSchema);

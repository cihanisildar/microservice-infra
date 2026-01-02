/**
 * Audit Domain Events
 */
export const AuditEvents = {
    LOG_CREATED: 'audit.log.created',
    LOG_CLEANED: 'audit.log.cleaned',
} as const;

export type AuditEventType = typeof AuditEvents[keyof typeof AuditEvents];

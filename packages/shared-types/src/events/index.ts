import { AuthEventType } from './auth.events.js';
import { AuditEventType } from './audit.events.js';
import { NotificationEventType } from './notification.events.js';
import { EventPayload } from './base.js';

export * from './auth.events.js';
export * from './audit.events.js';
export * from './notification.events.js';
export * from './base.js';

/**
 * Union type of all possible event types in the system
 */
export type EventType =
    | AuthEventType
    | AuditEventType
    | NotificationEventType;

/**
 * Concrete EventPayload type using the system's unified EventType
 */
export type GlobalEventPayload<T = any> = EventPayload<T, EventType>;

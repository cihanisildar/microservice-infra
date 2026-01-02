/**
 * Common metadata for all events in the system
 */
export interface EventMetadata {
    requestId: string;
    timestamp: number;
    source: string;
    userId?: string;
}

/**
 * Generic Event structure
 */
export interface EventPayload<T = any, E = string> {
    type: E;
    data: T;
    metadata: EventMetadata;
}

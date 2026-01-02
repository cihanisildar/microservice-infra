/**
 * Auth Domain Events
 */
export const AuthEvents = {
    USER_CREATED: 'user.created',
    USER_UPDATED: 'user.updated',
    USER_DELETED: 'user.deleted',
    LOGIN_SUCCESS: 'auth.login.success',
    LOGIN_FAILED: 'auth.login.failed',
} as const;

export type AuthEventType = typeof AuthEvents[keyof typeof AuthEvents];

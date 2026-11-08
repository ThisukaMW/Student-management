import { createContext } from 'react'

/**
 * {
 *   status: 'loading' | 'authenticated' | 'anonymous',
 *   user: the /auth/me response when authenticated,
 *   ended: why the last session stopped, e.g. { reason: 'expired' } (null if it didn't),
 *   login(email, password), logout(), endSession(reason, email)
 * }
 */
export const AuthContext = createContext(null)

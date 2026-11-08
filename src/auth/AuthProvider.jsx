import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../api/client.js'
import { AuthContext } from './context.js'

// ended: why the last session stopped ({ reason: 'expired' | 'loggedOut' | 'passwordChanged', email? }),
// so the login page can explain it. Pages don't navigate themselves after logging out: RequireAuth sees
// the anonymous state and does the one redirect, which avoids two redirects racing each other.
const anonymous = (ended = null) => ({ status: 'anonymous', user: null, ended })

export default function AuthProvider({ children }) {
  // With a stored refresh token the user may still be logged in, so start by checking
  const [state, setState] = useState(() =>
    api.hasStoredSession() ? { status: 'loading', user: null, ended: null } : anonymous())
  const restoring = state.status === 'loading'

  useEffect(() => {
    if (!restoring) return undefined
    let ignore = false
    api.restoreSession()
      .then((result) => {
        if (ignore) return
        if (result.ok) {
          setState({ status: 'authenticated', user: result.data, ended: null })
        } else {
          // There was a stored session but it could no longer be renewed
          setState(anonymous(result.status === 401 ? { reason: 'expired' } : null))
        }
      })
      .catch(() => {
        if (!ignore) setState(anonymous())
      })
    return () => {
      ignore = true
    }
  }, [restoring])

  // A request found the session can no longer be renewed
  useEffect(() => api.onSessionExpired(() => setState(anonymous({ reason: 'expired' }))), [])

  const login = useCallback(async (email, password) => {
    const result = await api.login(email, password)
    if (!result.ok) return result
    const account = await api.me()
    if (!account.ok) return account
    setState({ status: 'authenticated', user: account.data, ended: null })
    return account
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    setState(anonymous({ reason: 'loggedOut' }))
  }, [])

  // After a password change the server has already revoked the refresh tokens
  const endSession = useCallback((reason, email) => {
    api.forgetSession()
    setState(anonymous({ reason, email }))
  }, [])

  const value = useMemo(() => ({ ...state, login, logout, endSession }), [state, login, logout, endSession])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

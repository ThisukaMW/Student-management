import { Navigate, useLocation } from 'react-router'
import FullPageLoader from '../components/FullPageLoader.jsx'
import { homePathFor } from './roles.js'
import { useAuth } from './useAuth.js'

/**
 * Shows the page only to signed-in users, and only to the given roles if any are listed.
 * This is for navigation only; the backend enforces the real rules on every request.
 */
export default function RequireAuth({ roles, children }) {
  const { status, user, ended } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />
  if (status !== 'authenticated') {
    // Come back here after logging in, unless the user chose to leave (the next person to log in
    // may be someone else)
    const deliberate = ended?.reason === 'loggedOut' || ended?.reason === 'passwordChanged'
    return <Navigate to="/login" replace state={deliberate ? null : { from: location.pathname }} />
  }
  if (roles && !roles.includes(user.role)) return <Navigate to={homePathFor(user.role)} replace />
  return children
}

/**
 * Register and login pages: a signed-in user is sent on, to the page they were trying to open
 * before logging in or else their home page. This is also the redirect right after logging in.
 */
export function PublicOnly({ children }) {
  const { status, user } = useAuth()
  const location = useLocation()

  if (status === 'loading') return <FullPageLoader />
  if (status === 'authenticated') {
    return <Navigate to={location.state?.from ?? homePathFor(user.role)} replace />
  }
  return children
}

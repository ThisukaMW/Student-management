// Fetch wrapper for the backend REST API, with JWT access tokens and rotating refresh tokens.
//
// - The access token lives only in memory and is sent as "Authorization: Bearer <token>".
// - The refresh token is kept in localStorage so a page reload doesn't log the user out.
// - A request that gets 401 refreshes the tokens once and is retried.
//
// The backend treats a refresh token that is used twice as stolen and logs the user out
// everywhere, so refreshes must never overlap: one runs at a time per tab (a shared promise)
// and across tabs (the Web Locks API), and each one reads the newest token from storage.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const SERVER_UNREACHABLE =
  'Cannot reach the server. Make sure the backend is running on http://localhost:8080.'

const REFRESH_TOKEN_KEY = 'studentManagement.refreshToken'
const REFRESH_LOCK = 'studentManagement.tokenRefresh'

let accessToken = null
let refreshInFlight = null
const sessionExpiredListeners = new Set()

// Storage can throw (private mode, blocked site data); the app then behaves as logged out
function readRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  } catch {
    return null
  }
}

function writeRefreshToken(token) {
  try {
    if (token) localStorage.setItem(REFRESH_TOKEN_KEY, token)
    else localStorage.removeItem(REFRESH_TOKEN_KEY)
  } catch {
    // Nothing to do: without storage the session lasts until the tab is closed
  }
}

function storeTokens(tokens) {
  accessToken = tokens.accessToken
  writeRefreshToken(tokens.refreshToken)
}

function clearTokens() {
  accessToken = null
  writeRefreshToken(null)
}

/** True when a refresh token is stored, i.e. the user may still be logged in from an earlier visit. */
export function hasStoredSession() {
  return Boolean(readRefreshToken())
}

/** Called when the session can't be renewed (refresh token expired or revoked). Returns an unsubscribe function. */
export function onSessionExpired(listener) {
  sessionExpiredListeners.add(listener)
  return () => sessionExpiredListeners.delete(listener)
}

// Sends a JSON request and returns { ok, status, data }. Throws only on network failure.
async function send(path, { method = 'GET', body, token } = {}) {
  const options = { method, headers: {} }
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }
  if (token) {
    options.headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const text = await response.text()
  return { ok: response.ok, status: response.status, data: text ? JSON.parse(text) : null }
}

async function withRefreshLock(task) {
  if (typeof navigator !== 'undefined' && navigator.locks?.request) {
    return navigator.locks.request(REFRESH_LOCK, task)
  }
  return task()
}

// Resolves to true when new tokens were obtained
async function refreshTokens() {
  if (!refreshInFlight) {
    refreshInFlight = withRefreshLock(async () => {
      // Read inside the lock: another tab may have just rotated the token
      const refreshToken = readRefreshToken()
      if (!refreshToken) {
        accessToken = null
        return false
      }
      const result = await send('/auth/refresh', { method: 'POST', body: { refreshToken } })
      if (result.ok) {
        storeTokens(result.data)
        return true
      }
      if (result.status === 400 || result.status === 401) {
        // Only forget the token we tried; another tab may have stored a newer login meanwhile
        if (readRefreshToken() === refreshToken) clearTokens()
        else accessToken = null
      }
      return false
    }).finally(() => {
      refreshInFlight = null
    })
  }
  return refreshInFlight
}

// For endpoints that need a signed-in user
async function authRequest(path, options = {}) {
  if (!accessToken && readRefreshToken()) {
    await refreshTokens()
  }
  let result = await send(path, { ...options, token: accessToken })
  if (result.status === 401 && readRefreshToken() && (await refreshTokens())) {
    result = await send(path, { ...options, token: accessToken })
  }
  if (result.status === 401) {
    sessionExpiredListeners.forEach((listener) => listener())
  }
  return result
}

// The backend's validation errors as { fieldName: message }, for showing under each input
export function fieldErrorsOf(error) {
  const byField = {}
  for (const { field, message } of error?.fieldErrors ?? []) {
    byField[field] = byField[field] ? `${byField[field]}; ${message}` : message
  }
  return byField
}

export function errorMessageOf(error) {
  return error?.message || 'Something went wrong. Please try again.'
}

// --- Auth ---

/** Public sign-up: creates a STUDENT account and profile. */
export const register = (student) => send('/auth/register', { method: 'POST', body: student })

export async function login(email, password) {
  const result = await send('/auth/login', { method: 'POST', body: { email, password } })
  if (result.ok) storeTokens(result.data)
  return result
}

/** On reload: trade the stored refresh token for a new access token, then load the account. */
export async function restoreSession() {
  if (!(await refreshTokens())) return { ok: false, status: 401, data: null }
  return me()
}

/** Revokes the refresh token on the server, then forgets both tokens. Never throws. */
export async function logout() {
  // Built per attempt: after a refresh the stored refresh token is a new one, and sending the old,
  // already-rotated one would look like token theft and end every session
  const attempt = () => send('/auth/logout', {
    method: 'POST',
    token: accessToken,
    body: { refreshToken: readRefreshToken() },
  })
  try {
    if (readRefreshToken()) {
      if (!accessToken) await refreshTokens()
      const result = await attempt()
      if (result.status === 401 && (await refreshTokens())) await attempt()
    }
  } catch {
    // Offline: the refresh token simply expires on the server
  } finally {
    clearTokens()
  }
}

/** Forgets the tokens without calling the server, e.g. after a password change revoked them. */
export function forgetSession() {
  clearTokens()
}

export const me = () => authRequest('/auth/me')

export const changePassword = (currentPassword, newPassword) =>
  authRequest('/auth/me/password', { method: 'PUT', body: { currentPassword, newPassword } })

// --- Students ---

// 100 is the largest page the API allows
export const listStudents = () => authRequest('/students?size=100&sort=id,asc')

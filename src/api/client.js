// Small wrapper around fetch for the backend REST API.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api/v1'

export const SERVER_UNREACHABLE =
  'Cannot reach the server. Make sure the backend is running on http://localhost:8080.'

// Sends a JSON request and returns { ok, status, data }. Throws only on network failure.
async function request(path, { method = 'GET', body } = {}) {
  const options = { method, headers: {} }
  if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options)
  const text = await response.text()
  return {
    ok: response.ok,
    status: response.status,
    data: text ? JSON.parse(text) : null,
  }
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

export const registerStudent = (student) => request('/students', { method: 'POST', body: student })

export const login = (email, password) =>
  request('/auth/login', { method: 'POST', body: { email, password } })

// 100 is the largest page the API allows
export const listStudents = () => request('/students?size=100&sort=id,asc')

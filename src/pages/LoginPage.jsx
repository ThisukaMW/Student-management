import { useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { errorMessageOf, fieldErrorsOf, SERVER_UNREACHABLE } from '../api/client.js'
import { useAuth } from '../auth/useAuth.js'
import AuthLayout from '../components/AuthLayout.jsx'
import PasswordField from '../components/PasswordField.jsx'
import background from '../assets/pexels-tirachard-kumtanom-733857.jpg'
import avatar from '../assets/undraw_male_avatar_g98d.svg'

// Why the user landed here, shown above the form
function noticeFor(state, ended) {
  if (state?.registeredEmail) return { severity: 'success', text: 'Registration successful. You can now log in.' }
  if (ended?.reason === 'passwordChanged') {
    return { severity: 'success', text: 'Password changed. Please log in with your new password.' }
  }
  if (ended?.reason === 'expired') return { severity: 'warning', text: 'Your session has expired. Please log in again.' }
  if (ended?.reason === 'loggedOut') return { severity: 'info', text: 'You have been logged out.' }
  if (state?.from) return { severity: 'info', text: 'Please log in to continue.' }
  return null
}

export default function LoginPage() {
  const { state } = useLocation()
  const auth = useAuth()
  const prefilledEmail = state?.registeredEmail ?? auth.ended?.email

  const [email, setEmail] = useState(prefilledEmail ?? '')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const notice = noticeFor(state, auth.ended)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    try {
      const result = await auth.login(email, password)
      // On success PublicOnly redirects (to the page they tried to open, or their home page)
      if (result.ok) return
      if (result.status === 401) {
        setError('Incorrect email or password')
      } else {
        const byField = fieldErrorsOf(result.data)
        setFieldErrors(byField)
        if (Object.keys(byField).length === 0) setError(errorMessageOf(result.data))
      }
    } catch {
      setError(SERVER_UNREACHABLE)
    }
    setSubmitting(false)
  }

  return (
    <AuthLayout background={background} illustration={avatar} title="Welcome back" subtitle="Student Management System">
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {notice && !error && <Alert severity={notice.severity}>{notice.text}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            id="login-email"
            label="Email"
            type="email"
            autoComplete="email"
            autoFocus={!prefilledEmail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
          />
          <PasswordField
            id="login-password"
            label="Password"
            autoComplete="current-password"
            autoFocus={Boolean(prefilledEmail)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
          />

          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Logging in…' : 'Log in'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don&apos;t have an account yet?{' '}
            <Link component={RouterLink} to="/">Sign up</Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  )
}

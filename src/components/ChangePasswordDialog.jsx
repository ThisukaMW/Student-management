import { useState } from 'react'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'
import { changePassword, errorMessageOf, fieldErrorsOf, SERVER_UNREACHABLE } from '../api/client.js'
import PasswordField from './PasswordField.jsx'

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' }

/** Calls onChanged() after a successful change; the server has then ended every session. */
export default function ChangePasswordDialog({ open, onClose, onChanged }) {
  const [form, setForm] = useState(EMPTY)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function update(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: undefined })
  }

  function close() {
    setForm(EMPTY)
    setFieldErrors({})
    setError(null)
    onClose()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' })
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const result = await changePassword(form.currentPassword, form.newPassword)
      if (result.ok) {
        setForm(EMPTY)
        onChanged()
        return
      }
      const byField = fieldErrorsOf(result.data)
      setFieldErrors(byField)
      if (Object.keys(byField).length === 0) setError(errorMessageOf(result.data))
    } catch {
      setError(SERVER_UNREACHABLE)
    }
    setSubmitting(false)
  }

  const field = (name) => ({
    id: `password-${name}`,
    name,
    value: form[name],
    onChange: update,
    error: Boolean(fieldErrors[name]),
    helperText: fieldErrors[name],
  })

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle>Change password</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <PasswordField label="Current password" autoComplete="current-password" autoFocus
                           {...field('currentPassword')} />
            <PasswordField label="New password" autoComplete="new-password" {...field('newPassword')}
                           helperText={fieldErrors.newPassword ?? 'At least 8 characters, with a letter and a digit'} />
            <PasswordField label="Confirm new password" autoComplete="new-password" {...field('confirmPassword')} />
            <Alert severity="info" variant="outlined">You&apos;ll be signed out everywhere and asked to log in again.</Alert>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} disabled={submitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving…' : 'Change password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

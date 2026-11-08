import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Link from '@mui/material/Link'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { errorMessageOf, fieldErrorsOf, register, SERVER_UNREACHABLE } from '../api/client.js'
import AuthLayout from '../components/AuthLayout.jsx'
import PasswordField from '../components/PasswordField.jsx'
import background from '../assets/top-view-business-office-desk-background-applying-job-form-pen-pencil-eyeglasses-tree-mobile-phone-wooden-table-background-with-copy-space.jpg'
import illustration from '../assets/undraw_mobile_payments_re_7udl.svg'

const EMPTY_FORM = {
  firstName: '',
  lastName: '',
  age: '',
  email: '',
  password: '',
  institute: '',
  batch: '',
  gender: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  function update(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    // Clear a field's error as soon as the user edits it
    if (fieldErrors[name]) setFieldErrors({ ...fieldErrors, [name]: undefined })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    try {
      const age = form.age.trim()
      const result = await register({
        ...form,
        age: age === '' ? null : Number(age),
        gender: form.gender || null,
      })
      if (result.status === 201) {
        navigate('/login', { state: { registeredEmail: result.data.email } })
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

  // Shared props for the plain text inputs: value, change handler and backend error
  const field = (name) => ({
    id: `register-${name}`,
    name,
    value: form[name],
    onChange: update,
    error: Boolean(fieldErrors[name]),
    helperText: fieldErrors[name],
  })

  return (
    <AuthLayout
      background={background}
      illustration={illustration}
      title="Student registration"
      subtitle="Create your student account"
      maxWidth={560}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="First name" autoComplete="given-name" autoFocus {...field('firstName')} />
            <TextField label="Last name" autoComplete="family-name" {...field('lastName')} />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Email" type="email" autoComplete="email" {...field('email')} />
            <TextField label="Age" type="number" sx={{ maxWidth: { sm: 170 } }} {...field('age')} />
          </Stack>

          <PasswordField
            label="Password"
            autoComplete="new-password"
            {...field('password')}
            helperText={fieldErrors.password ?? 'At least 8 characters, with a letter and a digit'}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Institute" {...field('institute')} />
            <TextField label="Batch" {...field('batch')} />
          </Stack>

          <FormControl error={Boolean(fieldErrors.gender)}>
            <FormLabel id="register-gender-label">Gender</FormLabel>
            <RadioGroup row aria-labelledby="register-gender-label" name="gender" value={form.gender} onChange={update}>
              <FormControlLabel value="MALE" control={<Radio />} label="Male" />
              <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
              <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
            </RadioGroup>
            {/* The backend says "must not be null", which means nothing to a student */}
            {fieldErrors.gender && <FormHelperText>Please select a gender</FormHelperText>}
          </FormControl>

          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register'}
          </Button>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already registered?{' '}
            <Link component={RouterLink} to="/login">Log in</Link>
          </Typography>
        </Stack>
      </Box>
    </AuthLayout>
  )
}

import { Link as RouterLink } from 'react-router'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { isStaff, ROLE_LABELS } from '../auth/roles.js'
import { useAuth } from '../auth/useAuth.js'
import AppShell from '../components/AppShell.jsx'

const GENDER_LABELS = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other' }

function Detail({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" component="div">{label}</Typography>
      <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>{value}</Typography>
    </Box>
  )
}

const DETAILS_GRID = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
}

/** The signed-in account from /auth/me, plus the student profile if there is one. */
export default function ProfilePage() {
  const { user } = useAuth()
  const student = user.student
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    : '—'

  return (
    <AppShell>
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Paper elevation={8} sx={{ p: { xs: 2.5, sm: 4 } }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 3, flexWrap: 'wrap', rowGap: 1 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
              {student ? `${student.firstName} ${student.lastName}` : 'My account'}
            </Typography>
            <Chip size="small" color="primary" label={ROLE_LABELS[user.role] ?? user.role} />
          </Stack>

          <Typography variant="overline" color="text.secondary">Account</Typography>
          <Box sx={{ ...DETAILS_GRID, mt: 1 }}>
            <Detail label="Email" value={user.email} />
            <Detail label="Member since" value={memberSince} />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="overline" color="text.secondary">Student profile</Typography>
          {student ? (
            <Box sx={{ ...DETAILS_GRID, mt: 1 }}>
              <Detail label="Student ID" value={student.id} />
              <Detail label="Age" value={student.age} />
              <Detail label="Institute" value={student.institute} />
              <Detail label="Batch" value={student.batch} />
              <Detail label="Gender" value={GENDER_LABELS[student.gender] ?? student.gender} />
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 1 }}>
              {ROLE_LABELS[user.role]} accounts don&apos;t have a student profile.
              {isStaff(user.role) && (
                <> See the <Link component={RouterLink} to="/students">student list</Link>.</>
              )}
            </Alert>
          )}
        </Paper>
      </Container>
    </AppShell>
  )
}

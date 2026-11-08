import { useCallback, useEffect, useState } from 'react'
import { Link as RouterLink } from 'react-router'
import Alert from '@mui/material/Alert'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import LogoutIcon from '@mui/icons-material/Logout'
import RefreshIcon from '@mui/icons-material/Refresh'
import { errorMessageOf, listStudents, SERVER_UNREACHABLE } from '../api/client.js'
import background from '../assets/pexels-mikael-blomkvist-6476588.jpg'

const COLUMNS = [
  ['id', 'ID'],
  ['firstName', 'First name'],
  ['lastName', 'Last name'],
  ['age', 'Age'],
  ['email', 'Email'],
  ['institute', 'Institute'],
  ['batch', 'Batch'],
  ['gender', 'Gender'],
]

const GENDER_LABELS = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other' }

// Resolves to { students, total, error } and never throws
async function fetchStudents() {
  try {
    const result = await listStudents()
    return result.ok
      ? { students: result.data.content, total: result.data.page.totalElements, error: null }
      : { students: [], total: 0, error: errorMessageOf(result.data) }
  } catch {
    return { students: [], total: 0, error: SERVER_UNREACHABLE }
  }
}

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [total, setTotal] = useState(0)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const apply = useCallback((result) => {
    setStudents(result.students)
    setTotal(result.total)
    setError(result.error)
    setLoading(false)
  }, [])

  useEffect(() => {
    let ignore = false
    fetchStudents().then((result) => {
      // Skip results that arrive after the page was left
      if (!ignore) apply(result)
    })
    return () => {
      ignore = true
    }
  }, [apply])

  function refresh() {
    setLoading(true)
    setError(null)
    fetchStudents().then(apply)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.55)), url(${background})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <AppBar position="static" color="transparent" elevation={0} sx={{ color: 'common.white' }}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" component="h1" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            Student Manager
          </Typography>
          {/* Text buttons on wider screens, icon-only buttons on phones */}
          <Button color="inherit" startIcon={<RefreshIcon />} onClick={refresh} disabled={loading}
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Refresh
          </Button>
          <IconButton color="inherit" aria-label="Refresh" onClick={refresh} disabled={loading}
                      sx={{ display: { sm: 'none' } }}>
            <RefreshIcon />
          </IconButton>
          <Button color="inherit" startIcon={<LogoutIcon />} component={RouterLink} to="/login"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Log out
          </Button>
          <IconButton color="inherit" aria-label="Log out" component={RouterLink} to="/login"
                      sx={{ display: { sm: 'none' } }}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Paper elevation={8} sx={{ overflow: 'hidden' }}>
          <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Registered students</Typography>
            {!loading && !error && (
              <Typography variant="body2" color="text.secondary">
                {total > students.length ? `showing ${students.length} of ${total}` : `${total} total`}
              </Typography>
            )}
          </Box>
          {loading ? <LinearProgress /> : <Box sx={{ height: 4 }} />}

          {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}

          <TableContainer>
            <Table size="small" aria-label="Registered students">
              <TableHead>
                <TableRow>
                  {COLUMNS.map(([key, label]) => (
                    <TableCell key={key} sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* React escapes every value it renders, so student data can't inject HTML */}
                {students.map((student) => (
                  <TableRow key={student.id} hover sx={{ '& td': { whiteSpace: 'nowrap' } }}>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.firstName}</TableCell>
                    <TableCell>{student.lastName}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.institute}</TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>
                      <Chip size="small" variant="outlined" label={GENDER_LABELS[student.gender] ?? student.gender} />
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && !error && students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={COLUMNS.length} sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                      No students registered yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  )
}

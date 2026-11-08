import { Navigate, Route, Routes } from 'react-router'
import RequireAuth, { PublicOnly } from './auth/RequireAuth.jsx'
import { STAFF_ROLES } from './auth/roles.js'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import StudentsPage from './pages/StudentsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><RegisterPage /></PublicOnly>} />
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/students" element={<RequireAuth roles={STAFF_ROLES}><StudentsPage /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

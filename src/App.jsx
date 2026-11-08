import { Navigate, Route, Routes } from 'react-router'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import StudentsPage from './pages/StudentsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/students" element={<StudentsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

import { useState } from 'react'
import { NavLink } from 'react-router'
import AppBar from '@mui/material/AppBar'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import GroupIcon from '@mui/icons-material/Group'
import KeyIcon from '@mui/icons-material/Key'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import { isStaff, ROLE_LABELS } from '../auth/roles.js'
import { useAuth } from '../auth/useAuth.js'
import background from '../assets/pexels-mikael-blomkvist-6476588.jpg'
import ChangePasswordDialog from './ChangePasswordDialog.jsx'

// Text links on wider screens, icon buttons on phones
function NavItem({ to, icon, label }) {
  const active = { bgcolor: 'rgba(255, 255, 255, 0.16)' }
  return (
    <>
      <Button color="inherit" component={NavLink} to={to} startIcon={icon}
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, '&.active': active }}>
        {label}
      </Button>
      <IconButton color="inherit" component={NavLink} to={to} aria-label={label}
                  sx={{ display: { sm: 'none' }, '&.active': active }}>
        {icon}
      </IconButton>
    </>
  )
}

/** Page frame for signed-in users: navigation, account menu, change password and log out. */
export default function AppShell({ children }) {
  const { user, logout, endSession } = useAuth()
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [passwordOpen, setPasswordOpen] = useState(false)

  // No navigate() here: once signed out, RequireAuth redirects to /login and the login page
  // explains why, from the auth state
  async function handleLogout() {
    setMenuAnchor(null)
    await logout()
  }

  function handlePasswordChanged() {
    setPasswordOpen(false)
    endSession('passwordChanged', user.email)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.6)), url(${background})`,
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <AppBar position="static" color="transparent" elevation={0} sx={{ color: 'common.white' }}>
        <Toolbar sx={{ gap: 0.5 }}>
          <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            Student Manager
          </Typography>
          {isStaff(user.role) && <NavItem to="/students" icon={<GroupIcon />} label="Students" />}
          <NavItem to="/profile" icon={<PersonIcon />} label="My profile" />
          <IconButton color="inherit" aria-label="Account" aria-haspopup="menu"
                      onClick={(event) => setMenuAnchor(event.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 15 }}>
              {user.email.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Box sx={{ px: 2, py: 1, maxWidth: 280 }}>
          <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{user.email}</Typography>
          <Chip size="small" label={ROLE_LABELS[user.role] ?? user.role} sx={{ mt: 0.5 }} />
        </Box>
        <Divider />
        <MenuItem onClick={() => { setMenuAnchor(null); setPasswordOpen(true) }}>
          <ListItemIcon><KeyIcon fontSize="small" /></ListItemIcon>
          Change password
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Log out
        </MenuItem>
      </Menu>

      <ChangePasswordDialog open={passwordOpen} onClose={() => setPasswordOpen(false)}
                            onChanged={handlePasswordChanged} />

      {children}
    </Box>
  )
}

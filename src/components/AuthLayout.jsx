import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

// Full-page background image with a centred card, shared by the register and login pages
export default function AuthLayout({ background, illustration, title, subtitle, maxWidth = 440, children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.45)), url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper elevation={8} sx={{ width: '100%', maxWidth, p: { xs: 3, sm: 4 } }}>
        <Stack spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
          {illustration && <Box component="img" src={illustration} alt="" sx={{ width: 96, height: 96 }} />}
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700, textAlign: 'center' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
        {children}
      </Paper>
    </Box>
  )
}

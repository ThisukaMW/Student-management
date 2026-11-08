import { createTheme } from '@mui/material/styles'

// Colours picked up from the original pages: the teal Register button and slate-blue headings
const theme = createTheme({
  palette: {
    primary: { main: '#3f8699' },
    secondary: { main: '#6a5acd' },
    background: { default: '#f4f6f8' },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, size: 'small' },
    },
  },
})

export default theme

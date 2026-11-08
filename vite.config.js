import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The backend's CORS allow-list includes http://localhost:5173, so the dev server
// must use exactly that port: strictPort fails fast instead of silently moving to 5174.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
})

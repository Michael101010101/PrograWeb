import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // En desarrollo, las peticiones a /api se envían al servidor Express.
    proxy: { '/api': 'http://localhost:3000' },
  },
})

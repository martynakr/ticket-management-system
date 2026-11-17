import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Always use 5173. The API's Origin check expects CLIENT_ORIGIN=http://localhost:5173,
    // so fail loudly instead of silently moving to another port if it's taken.
    port: 5173,
    strictPort: true,
    proxy: {
      // Forward /api/* to Express, e.g. /api/health -> http://localhost:3000/api/health.
      // The browser only talks to localhost:5173, so the auth cookie is same-origin and
      // CORS isn't needed. The path is kept as-is because Express routes start with /api.
      '/api': 'http://localhost:3000',
    },
  },
})

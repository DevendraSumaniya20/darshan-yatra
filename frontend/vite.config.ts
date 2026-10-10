import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The API runs separately in development: `npm run dev` in backend/.
// Set API_URL when it listens somewhere other than the default port.
const apiUrl = process.env.API_URL ?? 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': apiUrl,
      // Photographs are stored and served by the API.
      '/media': apiUrl,
    },
  },
})

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // The API runs separately in development; start it with `npm run dev` in backend/.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // GitHub Pages serves the site from /<repo>/, so the deploy workflow sets
  // BASE_PATH. Locally it is unset and the app is served from `/`. The app
  // reads `import.meta.env.BASE_URL` for the mock worker and API paths.
  const { BASE_PATH } = loadEnv(mode, '.', 'BASE_PATH')

  return {
    base: BASE_PATH || '/',
    plugins: [react()],
    // Optional: use the Node mock server instead of MSW.
    // server: { proxy: { '/api': 'http://localhost:4010' } },
  }
})

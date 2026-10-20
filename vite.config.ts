import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Runs on its own port (and, in production, its own subdomain) so the partner
// portal never shares an origin — and therefore never shares localStorage or
// cookies — with the admin dashboard. The separation is enforced server-side by
// the `is_partner` token claim; this keeps the browser from blurring it.
const apiProxy = {
  '/api': {
    target: process.env.VITE_PROXY_TARGET ?? 'https://api.sribees.com',
    changeOrigin: true,
  },
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { proxy: apiProxy },
  preview: { proxy: apiProxy },
})

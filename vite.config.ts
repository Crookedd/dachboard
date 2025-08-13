import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config();

const apiBase = process.env.VITE_API;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: apiBase,
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""),
      },
    },
  },
})

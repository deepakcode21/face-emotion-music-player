import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss() 
  ],
  resolve: {
    alias: {
      fs: false,
      path: false,
      os: false,
    },
  },
  build: {
    commonjsOptions: {
      include: [/face-api.js/, /node_modules/],
      ignore: ['fs', 'path', 'os'], 
    }
  },
  optimizeDeps: {
    exclude: ['face-api.js'], 
  }
})
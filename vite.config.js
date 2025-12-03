import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
   // Ye neeche wala hissa zaroori hai face-api.js ke liye
  optimizeDeps: {
    exclude: ['face-api.js']
  },
  build: {
    commonjsOptions: {
      include: [/face-api.js/] 
    }
  }
})

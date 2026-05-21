import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'  // أضف هذا السطر

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {               // أضف هذا الكائن بالكامل
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
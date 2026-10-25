import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El sitio vive en la raíz de https://daledalepinatas.github.io/
export default defineConfig({
  plugins: [react()],
  base: '/',
})

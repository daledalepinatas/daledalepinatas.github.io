import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// En GitHub Pages el sitio vive en https://<usuario>.github.io/diversion/
export default defineConfig({
  plugins: [react()],
  base: '/diversion/',
})

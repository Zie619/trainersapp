import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 80
  },
  optimizeDeps: {
    include: ['firebase/app', 'firebase/firestore' , 'firebase-admin'],
  },
  assetsInclude: ['**/*.glb' , '**/*.hdr'],
})

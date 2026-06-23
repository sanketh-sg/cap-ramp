import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
    proxy: {
      '/odata': {
        target: 'http://localhost:4004',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
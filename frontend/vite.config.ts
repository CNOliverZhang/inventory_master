import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 9701,
    proxy: {
      '/api': {
        target: 'http://localhost:9702',
        changeOrigin: true,
      },
    },
  },
})

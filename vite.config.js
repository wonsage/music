import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

let publicPath = './'
if (process.env.NODE_ENV === 'production') {
  publicPath = 'https://wonsage.github.io'
}
// https://vitejs.dev/config/
export default defineConfig({
  // base: '/muzic/',
  publicPath,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
  }
})

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

let publicPath = './'
let base = '/'
if (process.env.NODE_ENV === 'production') {
  base= '/muzic/'
  publicPath = 'https://wonsage.github.io'
}
// https://vitejs.dev/config/
export default defineConfig({
  base,
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

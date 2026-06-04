import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { ui } from '@sil/ui/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [vue(), ui()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url))
    },
    dedupe: ['@sil/ui', 'vue']
  }
})

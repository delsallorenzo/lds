import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { homeMarkup } from './scripts/static-pages.mjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    { name: 'portfolio-html', transformIndexHtml: html => html.replace('<!--portfolio-->', homeMarkup) },
    vue({ template: { compilerOptions: { isCustomElement: tag => tag === 'mux-video' } } }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

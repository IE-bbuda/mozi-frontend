import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir:
      // 'D:/KB_6th/final_project/Mozi/mozi-backend/src/main/webapp/resources',
      //'C:/KB-PJT/goal/mozi-backend/src/main/webapp/resources',
      //'C:/KB_fullstack/final_project/backend/0728/mozi-backend/src/main/webapp/resources',
      'C:/KB_Fullstack/10_finalProject/mozi-backend/src/main/webapp/resources',
  },
});

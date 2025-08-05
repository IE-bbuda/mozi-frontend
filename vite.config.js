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
    //'C:/dev/projects/mozi-backend/src/main/webapp/resources',
    outDir:
      //"D:/KB_6th/final_project/Mozi/mozi-backend/src/main/webapp/resources",
      //'C:/KB-PJT/goal/mozi-backend/src/main/webapp/resources',
     // 'C:/KB_fullstack/final_project/backend/0731/mozi-backend/src/main/webapp/resources',
    //'C:/KB_Fullstack/accountConnect/mozi_4_backend/src/main/webapp/resources',
  },
});

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // En desarrollo, /api y /uploads se redirigen al backend (mismo origen => cookies first-party)
  const target = env.DEV_API_PROXY || 'http://localhost:4000';
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': { target, changeOrigin: false },
        '/uploads': { target, changeOrigin: false },
      },
    },
    build: {
      sourcemap: false,
    },
  };
});

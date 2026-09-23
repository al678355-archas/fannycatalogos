import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // /api y /uploads se redirigen al backend (mismo origen => cookies first-party).
  // Aplica tanto a `npm run dev` como a `npm run preview`.
  const target = env.DEV_API_PROXY || 'http://localhost:4000';
  const proxy = {
    '/api': { target, changeOrigin: false },
    '/uploads': { target, changeOrigin: false },
  };
  return {
    plugins: [react()],
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
    build: {
      sourcemap: false,
    },
  };
});

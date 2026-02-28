import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: process.env.NODE_ENV === "development" ? {
      "/api": {
        target: "https://comelec-3.onrender.com",
        changeOrigin: true,
      },
    } : undefined,
  },
});
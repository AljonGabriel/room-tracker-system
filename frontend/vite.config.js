import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default {
  preview: {
    port: 4173, // optional, Render overrides this with $PORT
    host: true,
    allowedHosts: ['room-tracker-system-frontend.onrender.com'],
  },
};

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()] as any,
    server: {
        port: 5175,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5174',
                changeOrigin: true
            }
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true
    },
    resolve: {
        alias: {
            '@': '/src'
        }
    }
});
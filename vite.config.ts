import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'development')
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue(), vuetify({ autoImport: true }), svgLoader()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@tests': path.resolve(__dirname, './tests'),
      },
    },
    server: {
      port: Number(env.VITE_FRONTEND_PORT) || 5173, // fallback default
      host: '0.0.0.0', // Важно для работы в Docker
      watch: {
        usePolling: true, // Для работы в Docker на некоторых системах
      },
    },
    define: {
      __BUILD_DATE__: JSON.stringify(new Date().toISOString().split('T')[0]), // e.g. "2025-07-24"
    },
  }
})

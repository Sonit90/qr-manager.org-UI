import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (e.g., 'development')
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue(), vueDevTools(), vuetify({ autoImport: true })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.VITE_FRONTEND_PORT) || 5173, // fallback default
      host: '0.0.0.0', // Важно для работы в Docker
      watch: {
        usePolling: true, // Для работы в Docker на некоторых системах
      },
    },
  }
})

import { mergeConfig, defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      projects: [
        // Vue Test Utils with jsdom
        {
          extends: true,
          test: {
            name: { label: 'vtu-jsdom', color: 'yellow' },
            include: ['tests/vue-test-utils/jsdom/**/*.spec.ts'],
            setupFiles: ['tests/vue-test-utils/jsdom/setup.ts'],
            environment: 'jsdom',
            globals: true,
          },
        },
        // Vue Test Utils with happy-dom
        {
          extends: true,
          test: {
            name: { label: 'vtu-happy-dom', color: 'yellow' },
            include: ['tests/vue-test-utils/happy-dom/**/*.spec.ts'],
            setupFiles: ['tests/vue-test-utils/happy-dom/setup.ts'],
            environment: 'happy-dom',
            globals: true,
          },
        },
        {
          extends: true,
          test: {
            name: { label: 'vtl-jsdom', color: 'blue' },
            include: ['tests/vue-testing-library/jsdom/**/*.spec.ts'],
            setupFiles: ['tests/vue-testing-library/jsdom/setup.ts'],
            environment: 'jsdom',
            server: {
              deps: {
                inline: ['vuetify'],
              },
            },
            globals: true,
          },
        },
        {
          extends: true,
          test: {
            name: { label: 'vtl-happy-dom', color: 'blue' },
            include: ['tests/vue-testing-library/happy-dom/**/*.spec.ts'],
            setupFiles: ['tests/vue-testing-library/happy-dom/setup.ts'],
            environment: 'happy-dom',
            server: {
              deps: {
                inline: ['vuetify'],
              },
            },
            globals: true,
          },
        },
      ],
    },
  }),
)

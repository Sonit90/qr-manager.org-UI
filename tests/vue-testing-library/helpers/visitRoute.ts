import { render, type RenderOptions } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createRouter, createWebHistory } from 'vue-router'
import MockApp from '../__mocks__/MockApp.vue'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { routes } from '@/router/index.ts'
import { createVuetify } from 'vuetify'

interface VisitOptions extends Omit<RenderOptions<typeof MockApp>, 'global'> {
  stubActions?: boolean
}

export async function createTestRouter(initialPath = '/') {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  // set the initial route
  await router.push(initialPath)
  await router.isReady()
  return router
}

export async function visitRoute(url: string, options: VisitOptions = {}) {
  const { stubActions = false, ...renderOptions } = options

  // Initialize user-event
  const user = userEvent.setup()

  // Create a router instance
  const router = await createTestRouter(url)

  const pinia = createTestingPinia({ stubActions })
  setActivePinia(pinia)

  const vuetify = createVuetify()

  // Prepare global configuration
  const globalConfig = {
    plugins: [router, pinia, vuetify],
    mocks: {
      // Default mocks
      $t: (key: string, params?: Record<string, never>) => {
        if (params) {
          return key.replaceAll(/\{(\w+)}/g, (match, param) => params[param] || match)
        }
        return key
      },
    },
  }

  // Render the MockApp component
  const view = render(MockApp, {
    global: {
      ...globalConfig,
    },
    ...renderOptions,
  })

  return {
    user,
    view,
  }
}

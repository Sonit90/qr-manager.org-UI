import { render, type RenderOptions } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { createRouter, createWebHistory } from 'vue-router'
import MockApp from '../__mocks__/MockApp.vue'
import { setActivePinia } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { routes } from '@/router'
import { createVuetify } from 'vuetify'

interface VisitOptions extends Omit<RenderOptions<typeof MockApp>, 'global'> {
  stubActions?: boolean
}

export async function visitRoute(url: string, options: VisitOptions = {}) {
  const { stubActions = false, ...renderOptions } = options

  // Initialize user-event
  const user = userEvent.setup()

  // Create router instance
  const router = createRouter({
    history: createWebHistory(),
    routes,
  })

  const pinia = createTestingPinia({ stubActions })
  setActivePinia(pinia)

  // Set initial URL
  await router.push(url)
  await router.isReady()

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
    stubs: {
      'router-link': {
        template: '<a :href="to"><slot /></a>',
        props: ['to'],
      },
      'router-view': {
        template: '<div class="router-view"><component :is="component" /></div>',
        props: ['component'],
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

  // Wait for any pending navigation
  await router.isReady()

  return {
    user,
    view,
  }
}

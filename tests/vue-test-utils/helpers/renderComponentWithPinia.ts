import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

export function renderComponentWithPinia<T>(component: T) {
  return mount(component, {
    global: {
      plugins: [createTestingPinia()],
    },
  })
}

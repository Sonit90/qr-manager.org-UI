import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/index.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  const { isAuthenticated } = storeToRefs(userStore)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const disallowAuthenticated = to.matched.some((record) => record.meta.disallowAuthenticated)

  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (requiresAuth && !isAuthenticated.value) {
    notify({
      title: 'Auth required',
      text: 'You have to be authenticated to access this page',
      type: 'warn',
    })
    return next('/login')
  }

  if (disallowAuthenticated && isAuthenticated.value) {
    return next('/user')
  }

  next()
})

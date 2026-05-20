import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { queryClient } from '@/tanstack/queryClient.ts'
import { fetchUserQuery } from '@/tanstack/useUser.ts'
import { TypeRoleV1 } from '@/api/__generated__/v1/data-contracts.ts'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  const { isAuthenticated } = storeToRefs(userStore)
  const requiresAuth = to.meta.requiresAuth
  const disallowAuthenticated = to.meta.disallowAuthenticated
  const requiredRoles = to.meta.roles as TypeRoleV1[]

  if (requiresAuth && !isAuthenticated.value) {
    notify({
      title: 'Auth required',
      text: 'You have to be authenticated to access this page',
      type: 'warn',
    })
    return next('/login')
  }

  if (requiredRoles) {
    const user = await queryClient.fetchQuery(fetchUserQuery)
    if (!user.role) {
      return next('/user')
    }

    if (!requiredRoles.includes(user.role)) {
      notify({
        type: 'warn',
        title: 'Permission denied',
        text: `This page requires to have ${requiredRoles.join(' ')} roles`,
      })
      return next('/user')
    }
    return next()
  }

  if (disallowAuthenticated && isAuthenticated.value) {
    return next('/user')
  }

  next()
})

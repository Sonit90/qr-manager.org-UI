import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/files',
      name: 'files',
      component: () => import('@/modules/files/FilesView.vue'),
    },
    {
      path: '',
      component: () => import('@/layouts/LoginLayout.vue'),
      children: [
        {
          path: 'login',
          component: () => import('@/modules/auth/LoginPage.vue'),
        },
        {
          path: 'register',
          component: () => import('@/modules/auth/RegisterPage.vue'),
        },
        {
          path: 'reset-password',
          component: () => import('@/modules/auth/ResetPasswordPage.vue'),
        },
      ],
    },
  ],
})

export default router

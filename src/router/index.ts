export const routes = [
  {
    path: '/files',
    name: 'files',
    component: () => import('@/modules/files/FilesView.vue'),
  },
  {
    path: '',
    redirect: '/login',
    component: () => import('@/layouts/LoginLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/modules/auth/LoginPage.vue'),
        meta: {
          disallowAuthenticated: true,
        },
      },
      {
        path: 'register',
        component: () => import('@/modules/auth/RegisterPage.vue'),
        meta: {
          disallowAuthenticated: true,
        },
      },
      {
        path: 'reset-password',
        component: () => import('@/modules/auth/ResetPasswordPage.vue'),
        meta: {
          disallowAuthenticated: true,
        },
      },
    ],
  },
  {
    path: '/activate',
    component: () => import('@/modules/auth/activation/EmailActivation.vue'),
    meta: {
      title: 'Activate Account',
    },
  },
  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        meta: {
          requiresAuth: true,
        },
        component: () => import('@/modules/user/UserPage.vue'),
      },
    ],
  },
]

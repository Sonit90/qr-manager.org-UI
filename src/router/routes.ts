import { TypeRoleV1 } from '@/api/__generated__/v1/data-contracts.ts'

export const routes = [
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
        path: 'forgot-password',
        component: () => import('@/modules/auth/forgot-password/ForgotPasswordRequestPage.vue'),
        meta: {
          disallowAuthenticated: true,
        },
      },
      {
        path: 'reset-password',
        component: () => import('@/modules/auth/forgot-password/ResetPasswordWithToken.vue'),
      },
    ],
  },
  {
    path: '/activate',
    component: () => import('@/modules/auth/activation/EmailActivation.vue'),
    meta: {
      disallowAuthenticated: true,
    },
  },

  {
    path: '/qr-disabled',
    name: 'qr-disabled',
    component: () => import('@/modules/qr/QrDisabledPage.vue'),
  },

  {
    path: '/user',
    component: () => import('@/layouts/UserLayout.vue'),
    children: [
      {
        path: '',
        redirect: '/qrs',
      },
      {
        path: '/profile',
        name: 'profile',
        component: () => import('@/modules/user/UserPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/qrs',
        name: 'qrs',
        component: () => import('@/modules/qr/QrListPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/qrs/:id',
        name: 'qr-detail',
        component: () => import('@/modules/qr/QrDetailPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/admin/users',
        name: 'users',
        component: () => import('@/modules/admin/users/AdminUsers.vue'),
        meta: {
          requiresAuth: true,
          roles: [TypeRoleV1.EnumAdmin],
        },
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
]

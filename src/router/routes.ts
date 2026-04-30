import { UserRole } from '@/types/user/roles.ts'

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
      {
        path: '/my-files',
        name: 'my-files',
        component: () => import('@/modules/userFiles/UserFilesPage.vue'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: '/merges',
        name: 'merges',
        component: () => import('@/modules/merges/MergeProcesses.vue'),
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
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: '/files',
        name: 'files',
        component: () => import('@/modules/files/FilesView.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
]

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/files',
      name: 'files',
      component: () => import('../modules/files/FilesView.vue'),
    },
  ],
})

export default router

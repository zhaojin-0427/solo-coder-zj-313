import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      redirect: '/dresses',
      children: [
        {
          path: 'dresses',
          name: 'Dresses',
          component: () => import('../views/DressList.vue'),
          meta: { title: '服饰档案' }
        },
        {
          path: 'outfits',
          name: 'Outfits',
          component: () => import('../views/OutfitList.vue'),
          meta: { title: '主题搭配' }
        },
        {
          path: 'reservations',
          name: 'Reservations',
          component: () => import('../views/ReservationList.vue'),
          meta: { title: '租赁预约' }
        },
        {
          path: 'feedbacks',
          name: 'Feedbacks',
          component: () => import('../views/FeedbackList.vue'),
          meta: { title: '试穿反馈' }
        },
        {
          path: 'returns',
          name: 'Returns',
          component: () => import('../views/ReturnList.vue'),
          meta: { title: '归还验收' }
        },
        {
          path: 'statistics',
          name: 'Statistics',
          component: () => import('../views/Statistics.vue'),
          meta: { title: '数据统计' }
        }
      ]
    }
  ]
})

export default router

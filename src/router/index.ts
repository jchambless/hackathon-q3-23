import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import PlayPage from '@/views/PlayPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/play'
  },
  {
    path: '/play',
    name: 'Play',
    component: PlayPage,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

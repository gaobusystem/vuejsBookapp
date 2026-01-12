import { createRouter, createWebHistory } from 'vue-router'
import BookIndex from '@/pages/BookIndex.vue'
import BookSearch from '@/pages/BookSearch.vue'
import BookEdit from '@/pages/BookEdit.vue'
//import ConfDownload from '@/pages/ConfDownload.vue'

const routes = [
  {
    path: '/',
    name: 'BookIndex',
    component: BookIndex
  },
  {
    path: '/search',
    name: 'BookSearch',
    component: BookSearch
  },
  {
    path: '/edit/:id',
    name: 'BookEdit',
    component: BookEdit
  },
  {
    path: '/conf-download',
    name: 'ConfDownload',
    component: () => import('@/pages/ConfDownload.vue')
  },
  // Vue Router 4 では "*" は使えないので、正規表現に変更
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

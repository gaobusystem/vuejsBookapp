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
  routes,
  scrollBehavior(to, from, savedPosition) {
  console.log(to, from, savedPosition)
  return new Promise((resolve) => {
      setTimeout(() => {
        if (savedPosition) {
          return resolve(savedPosition)
        }
        if (to.hash) {
          return resolve({
            el: to.hash,
            top: 20,
            behavior: 'smooth'
          })
        }
        return resolve({ top: 0, left: 0, behavior: 'smooth' })
      }, 2000)
    })
  },
})

export default router

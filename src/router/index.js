import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import HomeAbout from '@/views/AboutView.vue'
import Manage from '@/views/Manage.vue'
import useUserStore from '@/stores/user'
const routes = [
  {
    name: 'home',
    path: '/',
    // component 应是@/views下的组件
    component: HomeView,
  },
  {
    name: 'about',
    path: '/about',
    component: HomeAbout,
  },
  {
    name: 'manage',
    alias: '/manage', // avoid redirecting
    path: '/manage-music',
    component: Manage,
    beforeEnter: (to, from, next) => {
    console.log('boforeEnter Guard')
      next()
    },
    meta: {
      requiresAuth: true,
    }
  },
  {
    // 其他路径都重定向回首页
    name: 'error',
    path: '/:catchAll(.*)*',
    redirect: {
      name: 'home',
    }
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 配置导航链接激活时样式
  linkExactActiveClass: 'text-yellow-500',
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // console.log('global beforeRouter')
  if(!to.meta.requiresAuth) {
    next()
  } else if (useUserStore().userLoggedIn) {
    console.log('已登录')
    next()
  } else {
    console.log('未登录，回首页')
    next({name: 'home'})
  }
})
export default router

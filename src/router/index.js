import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', name: 'login', component: () => import('@/views/login/index'), hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: '主页',
    hidden: true,
    children: [{
      path: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/acount',
    component: Layout,
    redirect: '/acount/index',
    name: '账号设置',
    meta: { title: '账号设置', icon: 'dashboard' },
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/acount/index'),
      meta: { title: '账号设置', icon: 'dashboard' }
    }]
  },
  {
    path: '/password',
    component: Layout,
    redirect: '/password/index',
    name: '修改密码',
    meta: { title: '修改密码', icon: 'dashboard' },
    hidden: true,
    children: [{
      path: 'index',
      component: () => import('@/views/password/index'),
      meta: { title: '修改密码', icon: 'dashboard' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export default router

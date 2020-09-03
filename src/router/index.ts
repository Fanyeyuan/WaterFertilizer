import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/back',
    name: 'Back',
    component: () => import('../views/Back.vue'),
    children: [
      {
        path: 'setting',
        name: 'Setting',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/back/Setting.vue'),
        children: [
          {
            path: 'device',
            name: 'Device',
            component: () => import('../views/back/setting/Device.vue')
          },
          {
            path: 'other',
            name: 'Other',
            component: () => import('../views/back/setting/Other.vue')
          },
          {
            path: '*',
            redirect: 'setting'
          }
        ]
      },
      {
        path: 'about',
        name: 'About',
        component: () =>
          import(/* webpackChunkName: "about" */ '../views/back/About.vue')
      },
      {
        path: 'mapView',
        name: 'MapView',
        component: () => import('../views/back/MapView.vue')
      },
      {
        path: 'group',
        name: 'Group',
        component: () => import('../views/back/Group.vue')
      },
      {
        path: 'param',
        name: 'Param',
        component: () => import('../views/back/Param.vue')
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  routes
})

export default router

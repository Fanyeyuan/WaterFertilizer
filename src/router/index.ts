import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: 'mapView',
        component: () => import('../views/home/MapView.vue')
      },
      {
        path: 'group',
        component: () => import('../views/home/Group.vue')
      },
      {
        path: 'param',
        component: () => import('../views/home/Param.vue')
      }
    ]
  },
  {
    path: '/setting',
    name: 'Setting',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Setting.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router

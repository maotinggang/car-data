import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: require('@/components/main').default,
      redirect: 'history',
      children: [
        {
          path: 'history',
          name: 'history',
          component: () => import('@/components/history')
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: () => import('@/components/statistics')
        }
      ]
    }
  ]
})

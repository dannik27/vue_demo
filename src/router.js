import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import Cards from './components/cards/cards'
import Charts from './components/charts/charts'
import YaMap from './components/map/yandex-map'
import Board from './components/kanban/board'
import MyBoard from './components/kanban/my-board'

import LifeTracker from './components/lifetracker/lifetracker'

import HealthStar from './components/health-star/health-star'
import HealthStarWelcome from './components/health-star/welcome'
import HealthStarSearch from './components/health-star/search'
import HealthStarInfo from './components/health-star/info'

import Punchlist from './components/punchlist/main'
import PunchlistHome from './components/punchlist/screens/home'
import PunchlistSchemaList from './components/punchlist/screens/schema-list'
import PunchlistSchema from './components/punchlist/screens/schema'
import PunchlistNewDefectForm from './components/punchlist/screens/new-defect-form'
import PunchlistCamera from './components/punchlist/screens/camera'
import PunchlistDefectList from './components/punchlist/screens/defect-list'
import PunchlistDefectCard from './components/punchlist/screens/defect-card'
import PunchlistAuthorization from './components/punchlist/screens/authorization'

const router = new VueRouter({
  routes: [
    { path: '/cards', component: Cards },
    { path: '/charts', component: Charts },
    { path: '/map', component: YaMap },
    { path: '/kanban', component: Board },
    { path: '/kanban2', component: MyBoard },
    { path: '/lifetracker', component: LifeTracker },
    {
      path: '/health-star',
      component: HealthStar,
      children: [
        {
          path: '/health-star/search',
          component: HealthStarSearch
        },
        {
          path: '/health-star/info/:id',
          component: HealthStarInfo
        },
        {
          path: '/health-star/welcome',
          component: HealthStarWelcome
        }
      ]
    },
    {
      path: '/punchlist',
      component: Punchlist,
      children: [
        {
          path: '/punchlist/authorization',
          name: 'authorization',
          component: PunchlistAuthorization
        },
        {
          path: '/punchlist/home',
          component: PunchlistHome
        },
        {
          path: '/punchlist/schema-list',
          name: 'schema-list',
          component: PunchlistSchemaList,
          props: route => ({
            ...route.params
          })
        },
        {
          path: '/punchlist/schema/:schemaId',
          component: PunchlistSchema,
          props: true
        },
        {
          path: '/punchlist/new-defect/:componentId',
          name: 'new-defect',
          component: PunchlistNewDefectForm,
          props: route => ({
            ...route.params
          })
        },
        {
          path: '/punchlist/camera',
          name: 'camera',
          component: PunchlistCamera
        },
        {
          path: '/punchlist/defect-list',
          name: 'defect-list',
          component: PunchlistDefectList,
          props: route => ({
            ...route.params
          })
        },
        {
          path: '/punchlist/defect-card/:defectId',
          component: PunchlistDefectCard,
          props: true
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.fullPath.startsWith('/punchlist/') && to.name !== 'authorization') {
    if (localStorage.getItem('token') == null) {
      next({ name: 'authorization' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

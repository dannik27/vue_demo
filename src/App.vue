<template>

    <div id="app">

        <p class="menu" v-show="true">
            <router-link to="/cards" tag="button">Cards</router-link>
            <router-link to="/charts" tag="button">Перейти к charts</router-link>
            <router-link to="/map" tag="button">Maps</router-link>
            <router-link to="/kanban" tag="button">Kanban</router-link>
            <router-link to="/kanban2" tag="button">Kanban2</router-link>
            <router-link to="/health-star/welcome" tag="button">HealthStar</router-link>
            <router-link to="/punchlist/home" tag="button">Punchlist</router-link>
        </p>

        <router-view></router-view>

    </div>

</template>

<script>

  import Vue from 'vue'
  import VueRouter from 'vue-router'

  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faPen, faCheck, faTimes, faEllipsisH, faPlus, faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  import store from './store/store'

  library.add(faPen, faCheck, faTimes, faEllipsisH, faPlus, faArrowLeft, faHome);
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  Vue.config.productionTip = false;

  Vue.use(VueRouter);

  import Cards from "./components/cards/cards"
  import Charts from "./components/charts/charts"
  import YaMap from "./components/map/yandex-map"
  import Board from "./components/kanban/board"
  import MyBoard from "./components/kanban/my-board"
  import HealthStar from "./components/health-star/health-star"
  import HealthStarWelcome from "./components/health-star/welcome"
  import HealthStarSearch from "./components/health-star/search"
  import HealthStarInfo from "./components/health-star/info"

  import Punchlist from "./components/punchlist/main"
  import PunchlistHome from "./components/punchlist/home"
  import PunchlistSchema from "./components/punchlist/schema"
  import PunchlistCamera from "./components/punchlist/camera"
  import PunchlistDefectList from "./components/punchlist/defect-list"
  import PunchlistDefectCard from "./components/punchlist/defect-card"



  const router = new VueRouter({
    routes: [
      {path: '/cards', component: Cards},
      {path: '/charts', component: Charts},
      {path: '/map', component: YaMap},
      {path: '/kanban', component: Board},
      {path: '/kanban2', component: MyBoard},
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
            path: '/punchlist/home',
            component: PunchlistHome
          },
          {
            path: '/punchlist/schema',
            component: PunchlistSchema
          },
          {
            path: '/punchlist/camera',
            component: PunchlistCamera
          },
          {
            path: '/punchlist/defect-list',
            component: PunchlistDefectList
          },
          {
            path: '/punchlist/defect-card',
            component: PunchlistDefectCard
          }
        ]
      }
    ]
  });



  export default {
    name: 'app',
    router,
    store
  }
</script>

<style>

    @import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
    @import '../node_modules/hooper/dist/hooper.css';

    body{
        height: 100%;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        color: #2c3e50;
        /*margin-top: 60px;*/
    }

    .menu{
        text-align: center;
    }

</style>

<template>

    <div id="app">

        <div class="menu" v-show="false">
            <router-link to="/cards" tag="button">Cards</router-link>
            <router-link to="/charts" tag="button">Перейти к charts</router-link>
            <router-link to="/map" tag="button">Maps</router-link>
            <router-link to="/kanban" tag="button">Kanban</router-link>
            <router-link to="/kanban2" tag="button">Kanban2</router-link>
            <router-link to="/health-star/welcome" tag="button">HealthStar</router-link>
            <router-link to="/punchlist/home" tag="button">Punchlist</router-link>
        </div>

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
  import PunchlistSchemaList from "./components/punchlist/schema-list"
  import PunchlistSchema from "./components/punchlist/schema"
  import PunchlistNewDefectForm from "./components/punchlist/new-defect-form"
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
            path: '/punchlist/schema-list',
            component: PunchlistSchemaList
          },
          {
            path: '/punchlist/schema/:schemaId',
            component: PunchlistSchema,
            props: true
          },
          {
            path: '/punchlist/new-defect/:componentId',
            component: PunchlistNewDefectForm,
            props: true
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

    @import 'assets/material-button.css';
    @import 'assets/custom-elements.css';

    :root {
        --color-primary: #00796b;
        --color-primary-dark: #004c40;
        --color-primary-light: #48a999;
        --color-secondary: #ffa000;
        --color-secondary-dark: #c67100;
        --color-secondary-light: #ffd149;
        --text-primary: #ffffff;
        --text-secondary: #000000;
        --font: "Roboto", "Segoe UI", "serif";
    }

    html, body {
        margin: 0;
    }

    html {
        height: 100vh;
    }
    body {
        height: 100vh;
    }

    #app {

        /*margin-top: 60px;*/

        height: 100%;


    }

    .menu {
        text-align: center;
    }

    .content {

    }

</style>

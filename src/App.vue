<template>

    <div id="app">

        <p class="menu">
            <router-link to="/cards" tag="button">Cards</router-link>
            <router-link to="/fuzzy" tag="button">Перейти к fuzzy</router-link>
            <router-link to="/charts" tag="button">Перейти к charts</router-link>
            <router-link to="/vuex" tag="button">Перейти к vuex demo</router-link>
            <router-link to="/map" tag="button">Maps</router-link>
            <router-link to="/parser" tag="button">Parser</router-link>
            <router-link to="/kanban" tag="button">Kanban</router-link>
            <router-link to="/kanban2" tag="button">Kanban2</router-link>
            <router-link to="/navigator" tag="button">Navigator</router-link>
            <router-link to="/health-star" tag="button">HealthStar</router-link>
        </p>

        <router-view></router-view>

    </div>

</template>

<script>

  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import Vuex from 'vuex';

  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faPen, faCheck, faTimes, faEllipsisH, faPlus } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

  library.add(faPen, faCheck, faTimes, faEllipsisH, faPlus)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
  Vue.config.productionTip = false;

  Vue.use(VueRouter);
  Vue.use(Vuex);

  import Cards from "./components/cards/cards"
  import Fuzzy from "./components/fuzzy-search/fuzzy"
  import LikeSearch from "./components/fuzzy-search/like"
  import Charts from "./components/charts/charts"
  import VuexDemo from "./components/vuex/vuex-demo"
  import YaMap from "./components/map/yandex-map"
  import Parser from "./components/parser/parser"
  import Board from "./components/kanban/board"
  import MyBoard from "./components/kanban/my-board"
  import BrowserApi from "./components/navigator/browser-api"
  import HealthStar from "./components/health-star/health-star"
  import HealthStarWelcome from "./components/health-star/welcome"
  import HealthStarSearch from "./components/health-star/search"
  import HealthStarInfo from "./components/health-star/info"

  const router = new VueRouter({
    routes: [
      {path: '/cards', component: Cards},
      {path: '/fuzzy', component: Fuzzy},
      {path: '/like', component: LikeSearch},
      {path: '/charts', component: Charts},
      {path: '/vuex', component: VuexDemo},
      {path: '/map', component: YaMap},
      {path: '/parser', component: Parser},
      {path: '/kanban', component: Board},
      {path: '/kanban2', component: MyBoard},
      {path: '/navigator', component: BrowserApi},
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
      }
    ]
  });

  const store = new Vuex.Store({
    state: {
      stringArray: ['first', 'second', 'third']
    },
    mutations: {
      addItem (state, str) {
        state.stringArray.push(str);
      }
    }
  });

  export default {
    name: 'app',
    components: {
    },
    router,
    store
  }
</script>

<style>

    @import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
    @import '../node_modules/hooper/dist/hooper.css';

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        color: #2c3e50;
        margin-top: 60px;
    }

    .menu{
        text-align: center;
    }

</style>

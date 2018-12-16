<template>

    <div id="app">

        <p>
            <router-link to="/dasha" tag="button">Перейти к dasha</router-link>
            <router-link to="/fuzzy" tag="button">Перейти к fuzzy</router-link>
            <router-link to="/charts" tag="button">Перейти к charts</router-link>
            <router-link to="/vuex" tag="button">Перейти к vuex demo</router-link>
        </p>

        <router-view></router-view>

    </div>

</template>

<script>

  import Vue from 'vue'
  import VueRouter from 'vue-router'
  import Vuex from 'vuex';

  Vue.use(VueRouter)
  Vue.use(Vuex)

  import Dasha from "./components/dasha/dasha"
  import Fuzzy from "./components/fuzzy-search/fuzzy"
  import LikeSearch from "./components/fuzzy-search/like"
  import Charts from "./components/charts/charts"
  import VuexDemo from "./components/vuex/vuex-demo"

  const router = new VueRouter({
    routes: [
      {path: '/dasha', component: Dasha},
      {path: '/fuzzy', component: Fuzzy},
      {path: '/like', component: LikeSearch},
      {path: '/chart', component: Charts},
      {path: '/vuex', component: VuexDemo}
    ]
  })

  const store = new Vuex.Store({
    state: {
      stringArray: ['first', 'second', 'third']
    },
    mutations: {
      addItem (state, str) {
        state.stringArray.push(str);
      }
    }
  })

  export default {
    name: 'app',
    components: {
    },
    router,
    store
  }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>

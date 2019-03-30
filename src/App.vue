<template>
  <div id="app">
    <popup></popup>

    <div class="menu" v-show="false">
      <router-link to="/cards" tag="button">Cards</router-link>
      <router-link to="/charts" tag="button">Перейти к charts</router-link>
      <router-link to="/map" tag="button">Maps</router-link>
      <router-link to="/kanban" tag="button">Kanban</router-link>
      <router-link to="/kanban2" tag="button">Kanban2</router-link>
      <router-link to="/health-star/welcome" tag="button"
        >HealthStar</router-link
      >
      <router-link to="/punchlist/home" tag="button">Punchlist</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPen,
  faCheck,
  faTimes,
  faEllipsisH,
  faPlus,
  faArrowLeft,
  faHome,
  faUser,
  faCircle
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Loading from 'vue-loading-overlay'

import store from './store/store'

library.add(
  faPen,
  faCheck,
  faTimes,
  faEllipsisH,
  faPlus,
  faArrowLeft,
  faHome,
  faUser,
  faCircle
)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false

Vue.use(Loading, {
  color: '#ffa000',
  backgroundColor: '#004c40',
  loader: 'bars',
  width: 128,
  height: 128
})

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad)

import PopupPlugin from './plugins/popup-plugin'
Vue.use(PopupPlugin)

var VueCookie = require('vue-cookie')
Vue.use(VueCookie)

import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin)

Vue.directive('click-outside', {
  bind: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unbind: function(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
})

import router from './router'

export default {
  name: 'app',
  router,
  store
}
</script>

<style>
@import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
@import '../node_modules/hooper/dist/hooper.css';

@import '../node_modules/vue-image-lightbox/dist/vue-image-lightbox.min.css';

@import '../node_modules/vue-datetime/dist/vue-datetime.css';

@import '../node_modules/vue-loading-overlay/dist/vue-loading.css';

@import 'assets/material-button.css';
@import 'assets/custom-elements.css';

:root {
  --color-primary: #00796b;
  --color-primary-dark: #004c40;
  --color-primary-light: #48a999;
  --color-primary-light-opacity: rgba(72, 169, 153, 0.2);
  --color-secondary: #ffa000;
  --color-secondary-dark: #c67100;
  --color-secondary-light: #ffd149;
  --text-primary: #ffffff;
  --text-secondary: #000000;
  --font: 'Roboto', 'Segoe UI', 'serif';

  --color-inactive: #616161;
  --color-fine: #00695c;
  --color-success: #2e7d32;
  --color-warning: #ff8f00;
  --color-danger: #d84315;
}

html,
body {
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

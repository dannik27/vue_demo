import Popup from './popup.vue'

const PopupPlugin = {
  // every plugin for Vue.js needs install method
  // this method will run after Vue.use(<your-plugin-here>) is executed
  install(Vue, options) {
    // We must create new Eventbus
    // which is just another Vue instance that will be listening for and emiting events from our main instance
    // this EventBus will be available as Modal.EventBus
    this.EventBus = new Vue()

    // making our modal component global
    Vue.component('popup', Popup)

    // exposing global $modal object with method show()
    // method show() takes object params as argument
    // inside this object we can have modal title, text, styles... and also our callback confirm function
    Vue.prototype.$popup = {
      show(params) {
        // if we use this.$modal.show(params) inside our original Vue instance
        // we will emit 'show' event with parameters 'params'
        PopupPlugin.EventBus.$emit('show', params)
      }
    }
  }
}

export default PopupPlugin

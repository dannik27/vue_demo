<template>

    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">

                    <div class="modal-header">
                        <slot name="header">
                            default header
                        </slot>
                    </div>

                    <div class="modal-body">
                        <slot name="body">
                            default body
                        </slot>
                    </div>


                    <div class="buttons-bar">
                        <button
                                v-for="button in buttons"
                                :key="button.text"
                                class="modal-default-button"
                                @click="onButtonClick(button)">
                            {{button.text}}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </transition>

</template>

<script>


  export default {
    name: 'Dialog',
    props: ['buttons'],
    data() {
      return {}
    },
    methods: {
      onButtonClick(button){
        button.handler();
      }
    },
    mounted() {

    }
  }
</script>

<style scoped>

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 500px;
        margin: 0px auto;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header {
        padding: 10px;
    }

    .modal-header h3 {
        margin-top: 0;
        color: #42b983;
    }

    .modal-body {
        padding: 10px;
    }


    .buttons-bar {
        display: flex;
        justify-content: space-between;
    }

    .buttons-bar button {
        flex-basis: auto;
        flex-grow: 1;
        text-align: center;
        padding: 10px;
        /*border-radius: 4px;*/
    }

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    }

</style>

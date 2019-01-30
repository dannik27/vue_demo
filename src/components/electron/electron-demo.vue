<template>
    <div>
        <span>{{text}}</span>
        <button @click="clikk" >load</button>
    </div>

</template>

<script>

  // import { ipcRenderer } from 'electron'

  export default {
    name: 'Electron',
    data() {
      return {
        text: "kekes"
      }
    },
    methods: {
      clikk: function () {
        // ipcRenderer.send("lemme-data")
      }
    },
    mounted(){

      let self = this;

      // ipcRenderer.on("some-data", function (event, args) {
      //
      //   self.text = args.name;
      //
      // })
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>

<template>
    <div class="card">
        <EditableText class="editableText" v-model="ticket.summary"/>
    </div>


</template>

<script>

  import EditableText from "../elements/editable-text"

  import config from "../../config"

  export default {
    components: {EditableText},
    props: ['ticket'],
    data() {
      return {
        tette: "sadas"
      }
    },
    methods: {},
    mounted() {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .card {
        height: 100px;
        margin: 5px;
        padding: 5px;
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    }

    .card.dragged {
        opacity: 0.9;
    }

    .header-text {
        margin: 0;
    }

    .card-summary {
        color: black;
        margin: 0;
        font-size: 14px;
    }



</style>

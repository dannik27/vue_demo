<template>
    <div class="card" :style="{backgroundColor: pickColor()}">
        <EditableText id="summary" v-model="ticket.summary"/>
        <div>
            <span id="author">dani0318</span>
            <span>Kekes</span>
            <span id="date">12.04.1995</span>
        </div>
        <button class="btn-todo" @click="toggleTodo">TODO</button>
        <div id="todo-container" v-if="showTodo">
            <div v-for="todo in todos" :key="todo.name">
                <label>
                    <input v-model="todo.checked" type="checkbox">
                    <span>{{todo.name}}</span>
                </label>
            </div>
        </div>

    </div>


</template>

<script>

  import EditableText from "../elements/editable-text"

  import config from "../../config"

  const cardColors = [
    'azure',
    'beige',
    'bisque',
    'blanchedalmond',
    'burlywood',
    'cornsilk',
    'gainsboro',
    'ghostwhite',
    'ivory',
    'khaki'
  ]


  export default {
    components: {EditableText},
    props: ['ticket'],
    data() {
      return {
        cardColors,
        showTodo: false,
        todos: [
          {
            name: 'name1 dfgdf gdfgdfgfdg dfg fdgdfg fd gfdg fdg fdg',
            checked: false
          },
          {
            name: 'name2df gd fgd fgd fgdfgd fg fdg dfgdfgdfg',
            checked: false
          },
          {
            name: 'name3 dgd fgdf gd fgd fgdf gdf gdfg fdg dfg dfg d',
            checked: true
          }
        ]
      }
    },
    methods: {
      pickColor() {
        let rand = Math.floor(Math.random() * 10)
        return this.cardColors[rand]
      },

      toggleTodo() {
        this.showTodo = ! this.showTodo;
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .card {
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

    .btn-todo{
        margin: 5px 0px;
    }

    #summary{
        margin-bottom: 10px;
    }

    #date{
        float: right;
    }

    #author{
        color: #111;
        margin-right: 10px;
        background-color: #f05bff;
        border-radius: 10px;
        padding: 3px;
    }



</style>

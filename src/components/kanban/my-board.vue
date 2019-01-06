<template>
    <div class="card-scene">
        <Container
                orientation="horizontal"
                @drop="onColumnDrop($event)"
                drag-handle-selector=".column-drag-handle"
                @drag-start="dragStart"
        >
            <Draggable v-for="column in content.columns" :key="column.id">
                <div class="card-container">
                    <div class="card-column-header column-drag-handle">
                        <font-awesome-icon class="btn-add-card" @click="newCard(column)" size="2x" icon="plus" />
                        {{ column.name }}
                    </div>
                    <Container
                            group-name="col"
                            @drop="(e) => onCardDrop(column.id, e)"
                            @drag-start="(e) => log('drag start', e)"
                            @drag-end="(e) => log('drag end', e)"
                            :get-child-payload="getCardPayload(column.id)"
                            drag-class="card-ghost"
                            drop-class="card-ghost-drop"
                    >
                        <template v-for="card in column.tickets">
                            <Draggable :key="card.id">
                                <Card :ticket="card"></Card>
                            </Draggable>
                        </template>

                    </Container>
                </div>
            </Draggable>
        </Container>
    </div>
</template>

<script>
  import { Container, Draggable } from 'vue-smooth-dnd'
  import { applyDrag } from '../../utils/helpers'

  import Card from './card'


  const pickColor = () => {
    const rand = Math.floor(Math.random() * 10)
    return cardColors[rand]
  }

  const content = {
    columns: [
      {
        id: 'column1',
        name: 'col1',
        tickets: [
          {
            id: 'tic1',
            summary: 'tick1'
          },
          {
            id: 'tic2',
            summary: 'tick2'
          }
        ]
      },
      {
        id: 'column2',
        name: 'col2',
        tickets: [
          {
            id: 'tic3',
            summary: 'tick3'
          }
        ]
      }
    ]
  }


  export default {
    name: 'Cards',

    components: {Card, Container, Draggable},

    data () {
      return {
        content,
        columnClass: 'card-container',
        cardClass: 'card'
      }
    },

    methods: {
      onColumnDrop (dropResult) {
        let content = Object.assign({}, this.content)
        content.columns = applyDrag(content.columns, dropResult)
        this.content = content
      },

      onCardDrop (columnId, dropResult) {
        if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
          const content = Object.assign({}, this.content)
          const column = content.columns.filter(p => p.id === columnId)[0]
          const columnIndex = content.columns.indexOf(column)

          const newColumn = Object.assign({}, column)
          newColumn.tickets = applyDrag(newColumn.tickets, dropResult)
          content.columns.splice(columnIndex, 1, newColumn)

          this.content = content
        }
      },

      getCardPayload (columnId) {
        return index => {
          return this.content.columns.filter(p => p.id === columnId)[0].tickets[index]
        }
      },

      dragStart () {
        console.log('drag started')
      },

      log (...params) {
        console.log(...params)
      },

      newCard(column) {
        this.content.columns
            .filter(p => p.id === column.id)[0]
            .tickets.push({id: 'titi', summary:'asd'})
      }
    }
  }
</script>

<style scoped>

    .card-container {
        width: 320px;
        padding: 10px;
        margin: 5px;
        margin-right: 45px;
        background-color: #f3f3f3;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
    }

    .card {
        margin: 5px;
        /* border: 1px solid #ccc; */
        background-color: white;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
        padding: 10px;
    }

    .card-column-header {
        font-size: 18px;
    }

    .column-drag-handle {
        cursor: move;
        padding: 5px;
    }

    .card-ghost {
        transition: transform 0.18s ease;
        transform: rotateZ(5deg)
    }

    .card-ghost-drop {
        transition: transform 0.18s ease-in-out;
        transform: rotateZ(0deg)
    }

    .btn-add-card{
        cursor: pointer;
        margin-right: 5px;
    }

</style>
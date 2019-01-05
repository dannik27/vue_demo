<template>
    <div>

        <div>

        </div>

        <div class="board">

            <div v-bind:key="column.name" v-for="(column, index) in columns" class="column" draggable="true">
                <div class="column-header">
                    <span class="header-text">{{column.name}}</span>
                    <button class="button-add" :data-column="index">Add</button>
                </div>

                <card v-bind:ticket="ticket"
                      v-bind:key="ticket.summary"
                      v-for="ticket in column.tickets"
                      draggable="true"
                      v-on:drop="cardHandleDrop"
                />

            </div>
        </div>
    </div>



</template>

<script>

  import EditableText from "../elements/editable-text"

  import config from "../../config"
  import Card from "./card";

  export default {
    name: 'Dasha',
    components: {Card, EditableText},
    data() {
      return {
        tette: "sadas",
        persons: [],
        newPerson: {
          "id": 0,
          "name": "",
          "age": 0
        },
        columns: [
          {
            "name" : "Column 1",
            "tickets" : [
              {
                "summary":"ticket 1as das das das das das das dasd asd d asd dsa d asd asd asdas dasd "
              },
              {
                "summary":"ticket 2"
              },
              {
                "summary":"ticket 3"
              }
            ]
          },
          {
            "name" : "Column 2",
            "tickets" : [
              {
                "summary":"ticket 4"
              }
            ]
          },
        ],

        draggedItem: null,
        hoveredColumn: null,


      }
    },
    methods: {


      // ------------- CARD ------------

      cardHandleDrop(e) {
        e.stopPropagation();
        return false;
      },

      cardHandleDragStart(e) {
        draggedItem = this;
        hoveredColumn = this.parentNode;
        e.stopPropagation();


        // e.dataTransfer.setDragImage(hoveredColumn, 0, 0);

        this.classList.add('dragged');  // this / e.target is the source node.

        return true;
      },

      cardHandleDragOver(e) {
        // e.stopPropagation();
        if (this === draggedItem) return;
        if (isColumnDragged()) return false;

        if (e.preventDefault) {
          e.preventDefault();
        }
        e.stopPropagation();

        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        if (e.pageY - getCoords(this).top > this.offsetHeight / 2) {
          hoveredColumn.insertBefore(draggedItem, this.nextSibling);
        } else {
          hoveredColumn.insertBefore(draggedItem, this);
        }
        return false;
      },

      cardHandleDragEnter(e) {

        if (this === draggedItem) return;
        e.stopPropagation();

        hoveredColumn = this.parentNode;

      },

      cardHandleDragLeave(e) {

        if (this === draggedItem) return;
        e.stopPropagation();

      },


      cardHandleDragEnd(e) {
        e.stopPropagation();

      }

    },
    mounted() {

      var component = this;

      var board = document.querySelector('.board');

      var draggedItem = null;

      var hoveredColumn = null;

      function isCardDragged() {
        return draggedItem.classList.contains("card");
      }

      function isColumnDragged() {
        return draggedItem.classList.contains("column");
      }

      function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
          top: box.top + pageYOffset,
          left: box.left + pageXOffset
        };
      }


      // ------------------------ COLUMN --------------------------

      var cols = document.querySelectorAll('.column');
      cols.forEach(col => {
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false);
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
      });

      function handleDragStart(e) {
        draggedItem = this;



        this.classList.add('dragged');
      }

      function handleDragOver(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }

        if (this === draggedItem) return;
        if (isCardDragged()) return;

        e.dataTransfer.dropEffect = 'move';

        if (e.pageX - getCoords(this).left > this.offsetWidth / 2) {
          board.insertBefore(draggedItem, this.nextSibling);
        } else {
          board.insertBefore(draggedItem, this);
        }
        return false;
      }

      function handleDragEnter(e) {
        if (isCardDragged()) {
          hoveredColumn = this;
          return;
        }
        if (this === draggedItem) return;

      }

      function handleDragLeave(e) {
        if (isCardDragged()) {
          return;
        }
        if (this === draggedItem) return;

      }

      function handleDrop(e) {
        if (isCardDragged()) {
          hoveredColumn = null;
          return;
        }
        if (this === draggedItem) return;

        console.log(e)


        if (e.stopPropagation) {
          e.stopPropagation();
        }
        return false;
      }

      function handleDragEnd(e) {
        cols.forEach(col => {
          col.classList.remove('dragged');
        });
      }

      // ------------------------- CARD ---------------------------


      var cards = document.querySelectorAll('.card');
      cards.forEach(card => {
        card.addEventListener('dragstart', cardHandleDragStart, false);
        card.addEventListener('dragenter', cardHandleDragEnter, false);
        card.addEventListener('dragover', cardHandleDragOver, false);
        card.addEventListener('dragleave', cardHandleDragLeave, false);
        // card.addEventListener('drop', cardHandleDrop, false);
        card.addEventListener('dragend', cardHandleDragEnd, false);

      });


      // ------------------------- HEADER ---------------------------


      var headers = document.querySelectorAll('.column-header');
      headers.forEach(header => {
        header.addEventListener('dragover', headerHandleDragOver, false);
      });

      function headerHandleDragOver(e) {
        // e.stopPropagation();
        if (this === draggedItem) return;
        if (isColumnDragged()) return false;

        if (e.preventDefault) {
          e.preventDefault();
        }
        e.stopPropagation();


        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        hoveredColumn.appendChild(draggedItem);

        return false;
      }

      // ------------------------- BUTTON ---------------------------


      var buttons = document.querySelectorAll('.button-add');
      buttons.forEach(button => {
        button.addEventListener('click', headerAddButtonClick, false);
      });

      function headerAddButtonClick(e) {

        component.columns[this.dataset.column].tickets.push({summary: "sdad"});

      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .board {
        overflow: hidden;
        width: 2000px;
    }

    .column {
        background-color: #e0e0e0;
        float: left;
        width: 400px;
        margin: 10px;
        cursor: move;
    }

    .column.dragged {
        opacity: 0.4;
    }

    .column-header {
        background-color: #ffeb3b;
        height: 40px;
        margin: 5px;
        padding: 5px;

        border-radius: 2px;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

        text-align: right;
    }

    .column-header > button {
        height: 100%;
    }

    .header-text {
        margin: 0;
    }


</style>

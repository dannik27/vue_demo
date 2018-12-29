<template>
  <div class="container">
      <div class="column" draggable="true">
        <div class="column-header">
          <h1 class="header-text">Header 1</h1>
        </div>
        <div class="card" draggable="true">
          1
        </div>
        <div class="card" draggable="true">
          2
        </div>
      </div>

      <div class="column" draggable="true">
        <div class="column-header">
          <h1 class="header-text">Header 2</h1>
        </div>
        <div class="card" draggable="true">
          3
        </div>
      </div>

      <div class="column" draggable="true">
        <div class="column-header">
          <h1 class="header-text">Header 3</h1>
        </div>
        <div class="card" draggable="true">
          4
        </div>
      </div>
  </div>


</template>

<script>



import config from "../../config"

export default {
    name: 'Dasha',

    data () {
        return {
            persons : [],
            newPerson : {
                "id" : 0,
                "name" : "",
                "age" : 0
            }
        }
    },
    methods : {

    },
    mounted() {

      var container = document.querySelector('.container');

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
      cols.forEach(col =>{
        col.addEventListener('dragstart', handleDragStart, false);
        col.addEventListener('dragenter', handleDragEnter, false);
        col.addEventListener('dragover', handleDragOver, false);
        col.addEventListener('dragleave', handleDragLeave, false);
        col.addEventListener('drop', handleDrop, false);
        col.addEventListener('dragend', handleDragEnd, false);
      });

      var columnEnterCounter = 0;

      function handleDragStart(e) {
        draggedItem = this;

        this.classList.add('dragged');
      }

      function handleDragOver(e) {
        if (e.preventDefault) {
          e.preventDefault();
        }

        if (this === draggedItem) return;
        if(isCardDragged()) return;

        e.dataTransfer.dropEffect = 'move';

        if(e.pageX - getCoords(this).left > this.offsetWidth / 2) {
          container.insertBefore(draggedItem, this.nextSibling);
        } else {
          container.insertBefore(draggedItem, this);
        }
        return false;
      }

      function handleDragEnter(e) {
        if(isCardDragged()) {
          hoveredColumn = this;
          return;
        }
        if (this === draggedItem) return;

        this.classList.add('over');
        columnEnterCounter++;
      }

      function handleDragLeave(e) {
        if(isCardDragged()) {
          return;
        }
        if (this === draggedItem) return;

        columnEnterCounter--;
        if (columnEnterCounter === 0) {
          this.classList.remove('over');
        }
      }

      function handleDrop(e) {
        if(isCardDragged()) {
          hoveredColumn = null;
          return;
        }
        if (this === draggedItem) return;

        if (e.stopPropagation) {
          e.stopPropagation();
        }
        return false;
      }

      function handleDragEnd(e) {
        cols.forEach(col =>{
          col.classList.remove('over');
          col.classList.remove('dragged');
        });
      }

      // ------------------------- CARD ---------------------------


      var cards = document.querySelectorAll('.card');
      cards.forEach(card =>{
        card.addEventListener('dragstart', cardHandleDragStart, false);
        card.addEventListener('dragenter', cardHandleDragEnter, false);
        card.addEventListener('dragover', cardHandleDragOver, false);
        card.addEventListener('dragleave', cardHandleDragLeave, false);
        card.addEventListener('drop', cardHandleDrop, false);
        card.addEventListener('dragend', cardHandleDragEnd, false);

      });


      var cardEnterCounter = 0;

      function cardHandleDragStart(e) {
        draggedItem = this;
        hoveredColumn = this.parentNode;
        e.stopPropagation();

        // e.dataTransfer.setDragImage(hoveredColumn, 0, 0);

        this.classList.add('dragged');  // this / e.target is the source node.
      }

      function cardHandleDragOver(e) {
        // e.stopPropagation();
        if (this === draggedItem) return;
        if (isColumnDragged()) return false;

        if (e.preventDefault) {
          e.preventDefault();
        }
        e.stopPropagation();

        this.classList.add('over');

        e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

        if(e.pageY - getCoords(this).top > this.offsetHeight / 2) {
          hoveredColumn.insertBefore(draggedItem, this.nextSibling);
        } else {
          hoveredColumn.insertBefore(draggedItem, this);
        }
        return false;
      }

      function cardHandleDragEnter(e) {

        if (this === draggedItem) return;
        e.stopPropagation();

        this.classList.add('over');
        cardEnterCounter++;
      }

      function cardHandleDragLeave(e) {

        if (this === draggedItem) return;
        e.stopPropagation();

        cardEnterCounter--;
        if (cardEnterCounter === 0) {
          this.classList.remove('over');
        }
      }

      function cardHandleDrop(e) {
        e.stopPropagation();

        return false;
      }

      function cardHandleDragEnd(e) {
        e.stopPropagation();

        cols.forEach(col =>{
          col.classList.remove('over');
          col.classList.remove('dragged');
        });
      }

      // ------------------------- HEADER ---------------------------


      var headers = document.querySelectorAll('.column-header');
      headers.forEach(header =>{
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


    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .container{
    overflow: hidden;
    width: 2000px;
  }

  .column{
    background-color: crimson;
    float: left;
    width: 200px;
    margin: 10px;
    cursor: move;
  }

  .column.over {
    border: 2px dashed #000;
  }

  .column.dragged {
    opacity: 0.4;
  }

  .column-header{
    background-color: greenyellow;
    height: 40px;
    margin: 5px;

  }

  .card{
    background-color: darkblue;
    height: 100px;
    margin: 5px;
  }

  .card.over {
    border: 2px dashed #000;
  }

  .header-text{
    margin: 0;
  }

</style>

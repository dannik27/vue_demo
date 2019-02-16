<template>
    <div class="root">
        <canvas id="canvas"></canvas>

        <div id="hud" class="custom-panel">
            <p>Mouse X <span>{{mouseX}}</span></p>
            <p>Mouse Y <span>{{mouseY}}</span></p>
            <p>Zoom <span>{{zoom}}</span></p>
        </div>

    </div>

</template>

<script>


  export default {
    data() {
      return {
        mouseX: 0,
        mouseY: 0,
        zoom: 1,
        marks: [
          {
            name: "first",
            x: 1000,
            y: 1000,
            width: 100,
            height: 100
          },
          {
            name: "second",
            x: 1200,
            y: 1000,
            width: 100,
            height: 100
          }
        ]
      }
    },
    mounted() {

      this.$store.commit('setTitle', 'Schema')

      let self = this;

      let canvas;
      let ctx;
      let image;

      let sx, sy;
      let dx, dy, dWidth, dHeight;

      let zoomLevel = 1;

      init();

      function init() {

        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");

        image = new Image();
        image.src = 'schema1.png';

        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        image.onload = function () {

          ctx.drawImage(this, 0, 0);
          start();
        }


        canvas.onmousemove = function (e) {

          let realX = e.offsetX * zoomLevel + sx;
          let realY = e.offsetY * zoomLevel + sy;

          self.mouseX = e.offsetX + '(' + realX + ')'
          self.mouseY = e.offsetY + '(' + realY + ')'
        }

        canvas.onclick = function (e) {

          let realX = e.offsetX * zoomLevel + sx;
          let realY = e.offsetY * zoomLevel + sy;

          self.marks.filter(mark => {
            return contains(mark, realX, realY);
          }).forEach(markClicked)

        }

        initDrag();
        initZoom();

        console.log('init');
      }

      function initDrag() {

        let dragging;
        let lastX, lastY;

        canvas.addEventListener('mousedown', function (e) {
          dragging = true;

          lastX = e.offsetX;
          lastY = e.offsetY;

          // console.log('down')
        });

        canvas.addEventListener('mouseup', function (e) {
          dragging = false;
          // console.log('up')
        });

        canvas.addEventListener('mousemove', function (e) {
          if (dragging) {

            shift(e.offsetX - lastX, e.offsetY - lastY);
            lastX = e.offsetX;
            lastY = e.offsetY;

            // console.log('drag')
          }

        })

      }

      function initZoom() {

        canvas.addEventListener('wheel', function (e) {
          if (e.wheelDelta > 0) {
            zoom(e.offsetX, e.offsetY, 0.3)
          } else {
            zoom(e.offsetX, e.offsetY, -0.3)
          }
        })

      }

      function zoom(x, y, change) {

        if (zoomLevel + change <= 0.1 || zoomLevel + change > 5) {
          return;
        }

        let realX = x * zoomLevel;
        let realY = y * zoomLevel;

        let newX = realX * (zoomLevel + change) / zoomLevel;
        let newY = realY * (zoomLevel + change) / zoomLevel;

        zoomLevel += change

        shift((realX - newX) / zoomLevel * (-1), (realY - newY) / zoomLevel * (-1))

        self.zoom = zoomLevel;


      }

      function shift(x, y) {
        // console.log('drag' + ' -> ' + x + ' ' + y);

        sx -= x * zoomLevel;
        sy -= y * zoomLevel;

        render();
      }

      function markClicked(mark) {
        console.log(mark.name)
      }

      function start() {

        dx = 0;
        dy = 0;
        dWidth = canvas.width;
        dHeight = canvas.height;

        sx = 1000;
        sy = 1000;

        render()

      }


      function render() {

        ctx.drawImage(image, sx, sy, dWidth * zoomLevel, dHeight * zoomLevel, dx, dy, dWidth, dHeight)

        ctx.beginPath();
        ctx.lineWidth = "6";
        ctx.strokeStyle = "red";
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.stroke()

        self.marks.forEach(mark => {

          ctx.beginPath();
          ctx.lineWidth = 6 - zoomLevel;
          ctx.strokeStyle = "blue";
          ctx.rect(
              (mark.x - sx) / zoomLevel,
              (mark.y - sy) / zoomLevel,
              mark.width / zoomLevel,
              mark.height / zoomLevel);
          ctx.stroke();

        })

      }

      function contains(mark, x, y) {
        return (x > mark.x &&
            x < mark.x + mark.width &&
            y > mark.y &&
            y < mark.y + mark.height);

      }


    }
  }
</script>

<style scoped>

    @import "../../assets/custom-elements.css";

    .root{
        height: 100%;
        position: relative;
    }

    #canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #hud {
        position: absolute;
        top: 20px;
        left: 20px;
    }

    #hud > p > span {
        margin-left: 20px;
        font-weight: bold;
    }


</style>

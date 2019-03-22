<template>
  <div class="root">
    <canvas id="canvas"></canvas>

    <div v-show="false" id="hud" class="custom-panel">
      <p>
        Mouse X
        <span>{{mouseX}}</span>
      </p>
      <p>
        Mouse Y
        <span>{{mouseY}}</span>
      </p>
      <p>
        Zoom
        <span>{{zoom}}</span>
      </p>
    </div>

    <ComponentLinkWidget
      v-if="selectedMark"
      class="componentLinkWidget"
      v-bind:componentId="selectedMark.component.id"
      v-on:new-defect="createDefect($event)"
    />

    <NewComponentLinkWidget
      v-if="tempMark.visible"
      class="componentLinkWidget"
      v-bind:subsystems="schema.subsystems"
      v-on:new-defect-with-component="createDefectWithComponent($event)"
    />
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'
import api from '../../../services/backend/punchlist-api'

import ComponentLinkWidget from '../component-link-widget'
import NewComponentLinkWidget from '../new-component-link-widget'

export default {
  mixins: [screenMixin],
  components: { ComponentLinkWidget, NewComponentLinkWidget },
  props: ['schemaId'],
  data() {
    return {
      image: {
        id: 0,
        base64: ''
      },
      mouseX: 0,
      mouseY: 0,
      zoom: 1,
      schema: {},
      marks: [],
      tempMark: {
        x: 0,
        y: 0,
        radius: 50,
        color: 'green',
        visible: false
      },
      selectedMark: null
    }
  },
  mounted() {
    api.getSchemaFormData(this.schemaId).then(schema => {
      this.schema = schema
      this.initCanvas()
    })
  },
  methods: {
    createDefect(componentId) {
      // this.$router.push('/punchlist/new-defect/' + componentId)
      this.$router.push({
        name: 'new-defect',
        params: {
          componentId
        }
      })
    },

    createDefectWithComponent(component) {
      let componentLink = {
        x: this.tempMark.x,
        y: this.tempMark.y,
        radius: this.tempMark.radius,
        component
      }

      api.saveComponentLink(this.schema.id, componentLink).then(res => {
        this.$router.push('/punchlist/new-defect/' + res.componentId)
      })
    },

    initCanvas() {
      this.$store.commit('setTitle', 'Schema')

      let self = this

      let canvas
      let ctx
      let image

      let sx, sy
      let dx, dy, dWidth, dHeight

      let zoomLevel = 1

      init()

      function init() {
        canvas = document.getElementById('canvas')
        ctx = canvas.getContext('2d')

        image = new Image()
        image.src = 'data:image/png;base64,' + self.schema.image.base64

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        image.onload = function() {
          ctx.drawImage(this, 0, 0)
          start()
        }

        canvas.onmousemove = function(e) {
          let realX = e.offsetX * zoomLevel + sx
          let realY = e.offsetY * zoomLevel + sy

          self.mouseX = e.offsetX + '(' + realX + ')'
          self.mouseY = e.offsetY + '(' + realY + ')'
        }

        initDrag()
        initMarkEvents()
        initZoom()

        console.log('init')
      }

      function initDrag() {
        let dragging
        let lastX, lastY

        function start(x, y) {
          dragging = true

          lastX = x
          lastY = y
        }

        function move(x, y) {
          if (dragging) {
            shift(x - lastX, y - lastY)
            lastX = x
            lastY = y

            dropSelection()
          }
        }

        function end(x, y) {
          dragging = false
        }

        function dropSelection() {
          self.selectedMark = null
          self.tempMark.visible = false
        }

        canvas.addEventListener('mousedown', e => start(e.offsetX, e.offsetY))
        canvas.addEventListener('mousemove', e => move(e.offsetX, e.offsetY))
        canvas.addEventListener('mouseup', e => end(e.offsetX, e.offsetY))

        canvas.addEventListener('touchstart', e => {
          let canvasRect = canvas.getBoundingClientRect()
          start(
            e.targetTouches[0].pageX - canvasRect.left,
            e.targetTouches[0].pageY - canvasRect.top
          )
        })
        canvas.addEventListener('touchmove', e => {
          let canvasRect = canvas.getBoundingClientRect()
          move(
            e.targetTouches[0].pageX - canvasRect.left,
            e.targetTouches[0].pageY - canvasRect.top
          )
        })
        canvas.addEventListener('touchend', e => {
          let canvasRect = canvas.getBoundingClientRect()
          end(
            e.targetTouches[0].pageX - canvasRect.left,
            e.targetTouches[0].pageY - canvasRect.top
          )
        })
      }

      function initMarkEvents() {
        let pressTimer = null

        function pressStart(x, y) {
          if (pressTimer === null) {
            pressTimer = setTimeout(() => {
              schemaLongClick(x * zoomLevel + sx, y * zoomLevel + sy)
            }, 400)
          }
        }

        function pressEnd() {
          if (pressTimer !== null) {
            clearTimeout(pressTimer)
            pressTimer = null
          }
        }

        canvas.addEventListener('mousedown', e =>
          pressStart(e.offsetX, e.offsetY)
        )

        canvas.addEventListener('click', e => {
          pressEnd()

          let realX = e.offsetX * zoomLevel + sx
          let realY = e.offsetY * zoomLevel + sy

          self.schema.componentLinks
            .filter(mark => {
              return contains(mark, realX, realY)
            })
            .forEach(markClicked)
        })

        canvas.addEventListener('mousemove', pressEnd)
      }

      function initZoom() {
        canvas.addEventListener('wheel', function(e) {
          if (e.wheelDelta > 0) {
            zoom(e.offsetX, e.offsetY, 0.3)
          } else {
            zoom(e.offsetX, e.offsetY, -0.3)
          }
        })
      }

      function zoom(x, y, change) {
        if (zoomLevel + change <= 0.1 || zoomLevel + change > 5) {
          return
        }

        let realX = x * zoomLevel
        let realY = y * zoomLevel

        let newX = (realX * (zoomLevel + change)) / zoomLevel
        let newY = (realY * (zoomLevel + change)) / zoomLevel

        zoomLevel += change

        shift(
          ((realX - newX) / zoomLevel) * -1,
          ((realY - newY) / zoomLevel) * -1
        )

        self.zoom = zoomLevel
      }

      function shift(x, y) {
        // console.log('drag' + ' -> ' + x + ' ' + y);

        sx -= x * zoomLevel
        sy -= y * zoomLevel

        render()
      }

      function markClicked(mark) {
        self.selectedMark = mark
        self.tempMark.visible = false
        render()
      }

      function schemaLongClick(x, y) {
        self.tempMark.x = x
        self.tempMark.y = y
        self.tempMark.visible = true
        self.selectedMark = null

        render()
      }

      function start() {
        dx = 0
        dy = 0
        dWidth = canvas.width
        dHeight = canvas.height

        sx = 1000
        sy = 1000

        render()
      }

      function render() {
        ctx.drawImage(
          image,
          sx,
          sy,
          dWidth * zoomLevel,
          dHeight * zoomLevel,
          dx,
          dy,
          dWidth,
          dHeight
        )

        ctx.beginPath()
        ctx.lineWidth = '6'
        ctx.strokeStyle = 'red'
        ctx.rect(0, 0, canvas.width, canvas.height)
        ctx.stroke()

        if (self.tempMark.visible) {
          ctx.beginPath()
          ctx.lineWidth = 6 - zoomLevel
          ctx.strokeStyle = self.tempMark.color
          ctx.arc(
            (self.tempMark.x - sx) / zoomLevel,
            (self.tempMark.y - sy) / zoomLevel,
            self.tempMark.radius / zoomLevel,
            0,
            Math.PI * 2
          )
          ctx.stroke()
        }

        self.schema.componentLinks.forEach(mark => {
          ctx.beginPath()
          ctx.lineWidth = 6 - zoomLevel
          ctx.strokeStyle = 'blue'
          if (mark.radius) {
            ctx.arc(
              (mark.x - sx) / zoomLevel,
              (mark.y - sy) / zoomLevel,
              mark.radius / zoomLevel,
              0,
              Math.PI * 2
            )
          } else {
            ctx.rect(
              (mark.x - sx) / zoomLevel,
              (mark.y - sy) / zoomLevel,
              mark.width / zoomLevel,
              mark.height / zoomLevel
            )
          }
          ctx.stroke()
        })
      }

      function contains(mark, x, y) {
        const path = new Path2D()
        if (mark.radius) {
          path.arc(mark.x, mark.y, mark.radius, 0, Math.PI * 2)
        } else {
          path.rect(mark.x, mark.y, mark.width, mark.height)
        }
        return ctx.isPointInPath(path, x, y)
      }
    }
  }
}
</script>

<style scoped>
@import '../../../assets/custom-elements.css';

.root {
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

.componentLinkWidget {
  position: absolute;
  width: 250px;
  top: 20px;
  left: 20px;
}
</style>

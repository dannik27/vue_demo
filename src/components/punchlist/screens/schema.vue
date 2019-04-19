<template>
  <div class="root">
    <canvas id="canvas"></canvas>

    <div v-show="false" id="hud" class="custom-panel">
      <p>
        Mouse X
        <span>{{ mouseX }}</span>
      </p>
      <p>
        Mouse Y
        <span>{{ mouseY }}</span>
      </p>
      <p>
        Zoom
        <span>{{ internal.zoom }}</span>
      </p>
    </div>

    <ComponentLinkWidget
      v-if="selectedMark && selectedMark.entityName == 'component'"
      class="componentLinkWidget"
      v-bind:componentId="selectedMark.objectId"
      v-on:new-defect="createDefect($event)"
    />

    <NewComponentLinkWidget
      v-if="tempMark.visible"
      class="componentLinkWidget"
      v-bind:subsystems="schema.subsystems"
      v-on:new-defect-with-component="createDefectWithComponent($event)"
    />

    <div class="right-widget-container">
      <SearchWidget :schemaId="schemaId" @selected="moveToMark($event)">
      </SearchWidget>
    </div>
  </div>
</template>

<script>
import screenMixin from '../../../mixins/screen-mixin'
import api from '../../../services/backend/punchlist-api'

import ComponentLinkWidget from '../component-link-widget'
import NewComponentLinkWidget from '../new-component-link-widget'
import SearchWidget from '../search-widget'

export default {
  mixins: [screenMixin],
  components: { ComponentLinkWidget, NewComponentLinkWidget, SearchWidget },
  props: ['schemaId', 'markId'],
  data() {
    return {
      image: {
        id: 0,
        base64: ''
      },
      mouseX: 0,
      mouseY: 0,
      schema: null,
      tempMark: {
        x: 0,
        y: 0,
        radius: 50,
        color: 'green',
        visible: false
      },
      selectedMark: null,
      internal: {
        sx: 1000,
        sy: 1000,
        zoom: 1,
        renderFunction: null
      },

    }
  },
  mounted() {
    api.getFormData('schema', { schemaId: this.schemaId }).then(schema => {
      this.schema = schema
      if (this.markId) {
        this.moveToMark(this.markId)
      }

      this.initCanvas()
    })
  },
  methods: {

    moveToMark(markId) {
      let mark = this.schema.marks.find(
        link => link.id == markId
      )

      let markWidth = mark.radius
        ? mark.radius
        : mark.width

      let markHeight = mark.radius
        ? mark.radius
        : mark.height

      let zoomLevel = 1.5

      this.internal.sx =
        mark.x -
        document.getElementById('canvas').offsetWidth * zoomLevel / 2 +
        markWidth / 2
      this.internal.sy =
        mark.y -
        document.getElementById('canvas').offsetHeight * zoomLevel / 2 +
        markHeight / 2
      this.internal.zoom = zoomLevel

      this.selectedMark = mark

      if (this.internal.renderFunction) {
        this.internal.renderFunction()
      }
    },

    createDefect(componentId) {
      this.$router.push({
        name: 'new-defect',
        params: {
          componentId
        }
      })
    },

    createDefectWithComponent(component) {
      let mark = {
        x: this.tempMark.x,
        y: this.tempMark.y,
        radius: this.tempMark.radius,
        entityName: 'component',
        object: component
      }

      api.postFormData('createMark', { mark, schemaId: this.schema.id }).then(res => {
        this.$router.push('/punchlist/new-defect/' + res.objectId)
      })
    },

    initCanvas() {
      this.$store.commit('setTitle', 'Schema')

      let self = this

      let canvas
      let ctx
      let image

      // let sx, sy
      let dx, dy, dWidth, dHeight

      init()

      function init() {
        canvas = document.getElementById('canvas')
        ctx = canvas.getContext('2d')

        image = new Image()
        image.src = 'data:image/png;base64,' + self.schema.image.base64

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        image.onload = function () {
          ctx.drawImage(this, 0, 0)
          start()
        }

        canvas.onmousemove = function (e) {
          let realX = e.offsetX * self.internal.zoom + self.internal.sx
          let realY = e.offsetY * self.internal.zoom + self.internal.sy

          self.mouseX = e.offsetX + '(' + realX + ')'
          self.mouseY = e.offsetY + '(' + realY + ')'
        }

        initDrag()
        initMarkEvents()
        initZoom()

        self.internal.renderFunction = render;

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
              schemaLongClick(x * self.internal.zoom + self.internal.sx, y * self.internal.zoom + self.internal.sy)
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

          let realX = e.offsetX * self.internal.zoom + self.internal.sx
          let realY = e.offsetY * self.internal.zoom + self.internal.sy

          self.schema.marks
            .filter(mark => {
              return contains(mark, realX, realY)
            })
            .forEach(mark => markClicked(mark, e))
        })

        canvas.addEventListener('mousemove', pressEnd)
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
        if (self.internal.zoom + change <= 0.1 || self.internal.zoom + change > 5) {
          return
        }

        let realX = x * self.internal.zoom
        let realY = y * self.internal.zoom

        let newX = (realX * (self.internal.zoom + change)) / self.internal.zoom
        let newY = (realY * (self.internal.zoom + change)) / self.internal.zoom

        self.internal.zoom += change

        shift(
          ((realX - newX) / self.internal.zoom) * -1,
          ((realY - newY) / self.internal.zoom) * -1
        )

      }

      function shift(x, y) {
        // console.log('drag' + ' -> ' + x + ' ' + y);

        self.internal.sx -= x * self.internal.zoom
        self.internal.sy -= y * self.internal.zoom

        render()
      }

      function markClicked(mark, event) {
        self.selectedMark = mark
        self.tempMark.visible = false
        render()
        self.$popup.show({
          left: event.x,
          top: event.y,
          type: mark.entityName,
          objectId: mark.objectId
        })
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

        render()
      }

      function render() {
        ctx.drawImage(
          image,
          self.internal.sx,
          self.internal.sy,
          dWidth * self.internal.zoom,
          dHeight * self.internal.zoom,
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
          ctx.lineWidth = 6 - self.internal.zoom
          ctx.strokeStyle = self.tempMark.color
          ctx.arc(
            (self.tempMark.x - self.internal.sx) / self.internal.zoom,
            (self.tempMark.y - self.internal.sy) / self.internal.zoom,
            self.tempMark.radius / self.internal.zoom,
            0,
            Math.PI * 2
          )
          ctx.stroke()
        }

        self.schema.marks.forEach(mark => {
          ctx.beginPath()
          ctx.lineWidth = 6 - self.internal.zoom

          switch (mark.entityName) {
            case 'schema': ctx.strokeStyle = '#ffa000'; break;
            default: ctx.strokeStyle = 'blue'; break;
          }

          if (mark.radius) {
            ctx.arc(
              (mark.x - self.internal.sx) / self.internal.zoom,
              (mark.y - self.internal.sy) / self.internal.zoom,
              mark.radius / self.internal.zoom,
              0,
              Math.PI * 2
            )
          } else {
            if (mark.img) {
              let markImage = new Image();
              markImage.src = mark.img;
              ctx.drawImage(
                markImage,
                (mark.x - self.internal.sx) / self.internal.zoom,
                (mark.y - self.internal.sy) / self.internal.zoom,
                mark.width / self.internal.zoom,
                mark.height / self.internal.zoom
              )
            } else {
              ctx.rect(
                (mark.x - self.internal.sx) / self.internal.zoom,
                (mark.y - self.internal.sy) / self.internal.zoom,
                mark.width / self.internal.zoom,
                mark.height / self.internal.zoom
              )
            }
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

.right-widget-container {
  position: absolute;
  width: 300px;
  top: 20px;
  right: 20px;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>

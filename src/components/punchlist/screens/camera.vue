<template>
    <div ref="root" class="root">
        <video v-show="active" ref="video" autoplay></video>
        <canvas v-show="! active" ref="canvas"></canvas>

        <div class="hud">
            <button @click="capture">Capture</button>
            <button @click="restart" >Retry</button>
        </div>


    </div>

</template>

<script>

  import screenMixin from '../../../mixins/screen-mixin'


  export default {
    mixins: [screenMixin],
    data() {
      return {
        stream: null,
        active: true
      }
    },
    methods: {
        restart() {

          let self = this;

          let root = this.$refs.root;
          let video = this.$refs.video;


          let constraints = {
            audio: false,
            video: {
              width: root.clientWidth - 10,
              height: root.clientHeight - 10 }
          }

          if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
              self.stream = stream;
              video.srcObject = stream;
              video.play();
            });
          }

          this.active = true;

        },

        capture() {

          let canvas = this.$refs.canvas;
          let video = this.$refs.video;

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          // canvas.width = canvas.style.width;
          // canvas.height = canvas.style.height;

          canvas.getContext('2d').drawImage(video, 0, 0);

          this.cancel();
        },

        cancel() {
          this.stream.getTracks().forEach(track => track.stop())
          this.active = false;
          this.backForResult({
            dataUrl: this.$refs.canvas.toDataURL()
          });
        }

    },
    mounted() {

      this.$store.commit('setTitle', 'Camera')

      this.restart();

    },

    beforeDestroy(){
      // this.cancel();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .root {
        height: 100%;
        position: relative;
    }

    .hud{
        position: absolute;
        top: 0;
    }

</style>

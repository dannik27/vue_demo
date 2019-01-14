<template>
    <div>
        <video v-show="active" ref="video" autoplay></video>
        <canvas v-show="! active" ref="canvas"></canvas>

        <button @click="capture">Capture</button>
        <button @click="restart" >Retry</button>
    </div>

</template>

<script>


  export default {
    data() {
      return {
        stream: null,
        active: true
      }
    },
    methods: {
        restart() {

          let self = this;

          let video = this.$refs.video;

          if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: {width: {min: 1280}, height: {min: 720}} }).then(function(stream) {
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
          canvas.getContext('2d').drawImage(video, 0, 0);

          this.stream.getTracks().forEach(track => track.stop())
          this.active = false;
        }
    },
    mounted() {

      this.restart();

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>

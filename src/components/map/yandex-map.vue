<template id="parent">
    <yandex-map
            :coords="mapCoords"
            zoom="10"
            style="width: 600px; height: 600px;"
            :cluster-options="{
    1: {clusterDisableClickZoom: true}
  }"
            :controls="['fullscreenControl', 'geolocationControl', 'searchControl', 'zoomControl']"
            :placemarks="placemarks"
            @map-was-initialized="onMapInit"
    >


        <ymap-marker
                marker-id="3"
                marker-type="circle"
                :coords="circleCoords"
                :circle-radius="circleRadius"
                hint-content="Hint content 1"
                :marker-fill="{color: '#6a98e2', opacity: 0.4}"
                :marker-stroke="{color: '#1b68e5', width: 5}"
                :balloon="{header: 'header', body: 'body', footer: 'footer'}"
        ></ymap-marker>

    </yandex-map>
</template>

<script>

    const { yandexMap, ymapMarker } = require('vue-yandex-maps');

    export default {
        name: "YaMap",
        components: { yandexMap, ymapMarker },
        data() {
            return {
                placemarks: [],
                mapCoords: [54.62896654088406, 39.731893822753904],
                circleCoords: [0, 0],
                circleRadius: 1600
            }
        },
        methods : {
            onMapClick : function (coords) {

                this.circleCoords = coords
                this.mapCoords = coords
                this.placemarks.push({asd:1})
                this.placemarks.pop()

                // var mark = this.placemarks.pop()
                // mark.coords = coords;
                // this.placemarks.push(mark)

            },
            onMapInit : function(map) {

            var self = this;

            map.events.add('click', function(e){
                self.onMapClick(e.get('coords'))
            })
        }
        }
    }
</script>

<style scoped>

</style>
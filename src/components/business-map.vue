<template>
    <yandex-map
            :coords="[54.62896654088406, 39.731893822753904]"
            zoom="10"
            style="width: 600px; height: 600px;"
            :cluster-options="{
    1: {clusterDisableClickZoom: true}
  }"
            :controls="['fullscreenControl', 'geolocationControl', 'searchControl', 'zoomControl']"
            :placemarks="placemarks"
            @map-was-initialized="onMapInit"
            @click="onMapClick"
    >


        <ymap-marker
                marker-id="3"
                marker-type="circle"
                :coords="[54.62896654088406, 39.731893822753904]"
                circle-radius="1600"
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
        name: "BusinessMap",
        components: { yandexMap, ymapMarker },
        data() {
            return {
                placemarks: [
                    {
                        coords: [54.8, 39.8],
                        properties: {}, // define properties here
                        options: {}, // define options here
                        clusterName: "1",
                        balloonTemplate: '<div>"Your custom template"</div>',
                        callbacks: { click: function() {} }
                    }
                ]
            }
        },
        methods : {
            onMapClick : function (coords) {
                console.log("${coords.x}, ${coords.y}");
                this.placemarks[0].coords[0] = coords[0];
            },
            onMapInit : function(map) {

            var component = this;

            map.events.add('click', function(e){
                component.onMapClick(e.get('coords'))
            })
        }
        }
    }
</script>

<style scoped>

</style>
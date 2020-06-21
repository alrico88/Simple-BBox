<template lang="pug">
  .col-8.vh-100.px-0
    .h-100(:id="id")
</template>

<script>
import uuid from 'uuid/v4';
import {mapGetters} from 'vuex';
import circle from '@turf/circle';

export default {
  data() {
    return {
      id: uuid(),
      layers: {
        shapes: null,
        fullBBox: null,
      },
    };
  },
  computed: {
    ...mapGetters(['getPolygons', 'getFullBBoxPolygon']),
  },
  watch: {
    getPolygons(polygons) {
      this.drawPolygons(polygons);
    },
    getFullBBoxPolygon(fullBBox) {
      this.drawFullBBox(fullBBox);
    },
  },
  mounted() {
    this.map = L.map(this.id).setView([0, 0], 3);
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    ).addTo(this.map);
    const drawControl = new L.Control.Draw({
      draw: {
        circlemarker: false,
      },
    });
    this.map.addControl(drawControl);
    const store = this.$store;
    this.map.on('draw:created', (e) => {
      const {layer, layerType} = e;
      let asJSON;
      if (layerType === 'circle') {
        const {lat, lng} = layer._latlng;
        const circlePolygon = circle([lng, lat], layer.getRadius(), {
          steps: 100,
          units: 'meters',
        });
        asJSON = circlePolygon;
      } else {
        asJSON = layer.toGeoJSON();
      }
      store.dispatch('addPolygon', asJSON.geometry);
    });
    if (this.getPolygons.length > 0) {
      this.drawPolygons(this.getPolygons);
    }
    if (this.getFullBBoxPolygon !== null) {
      this.drawFullBBox(this.getFullBBoxPolygon);
    }
  },
  methods: {
    removeDrawn(layer) {
      const lyr = this.layers[layer];
      if (lyr !== null) {
        this.map.removeLayer(lyr);
      }
    },
    addDrawn(featureLayer, layer) {
      this.removeDrawn(layer);
      this.layers[layer] = featureLayer;
      featureLayer.addTo(this.map);
    },
    drawPolygons(polygons) {
      const featureGroup = L.featureGroup();
      polygons.forEach((polygon) => {
        function onEachFeature(feature, layer) {
          layer.bindTooltip(polygon.id, {
            permanent: true,
            direction: 'top',
          });
        }
        L.geoJSON(polygon.geojson, {
          onEachFeature,
          style: {
            color: 'blue',
            fillOpacity: 0.1,
          },
        }).addTo(featureGroup);
        L.geoJSON(polygon.bboxPolygon, {
          style: {
            color: 'red',
            fillOpacity: 0.09,
          },
        }).addTo(featureGroup);
      });
      this.addDrawn(featureGroup, 'shapes');
    },
    drawFullBBox(fullBBox) {
      const featureGroup = L.featureGroup();
      L.geoJSON(fullBBox, {
        style: {
          color: 'green',
          fillOpacity: 0.02,
          opacity: 0.5,
        },
      }).addTo(featureGroup);
      this.addDrawn(featureGroup, 'fullBBox');
    },
  },
};
</script>

import Vue from 'vue';
import Vuex from 'vuex';
import shortid from 'shortid';
import area from '@turf/area';
import {processNumber} from 'number-helper-functions';
import bbox from '@turf/bbox';
import bboxPolygon from '@turf/bbox-polygon';
import {featureCollection, feature} from '@turf/helpers';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    polygons: [],
  },
  getters: {
    getPolygons(state) {
      return state.polygons;
    },
    getPolygonIds(state) {
      return state.polygons.map((d) => d.id);
    },
    getFullBBox(state) {
      return state.polygons.length > 0
        ? bbox(featureCollection(state.polygons.map((d) => {
                if (d.geojson.type !== 'Feature') {
                  return feature(d.geojson);
                } else {
                  return d.geojson;
                }
              })))
        : [];
    },
    getFullBBoxPolygon(state, getters) {
      const fullBBox = getters.getFullBBox;
      return fullBBox.length > 0 ? bboxPolygon(fullBBox) : null;
    },
    getPolygonArea: (state) => (id) => {
      const obj = state.polygons.find((d) => d.id === id);
      return processNumber(area(obj.geojson) / 1000000);
    },
  },
  mutations: {
    updatePolygons(state, polygons) {
      state.polygons = polygons;
    },
    addToPolygons(state, polygon) {
      state.polygons.push(polygon);
    },
    deleteFromPolygons(state, position) {
      state.polygons.splice(position, 1);
    },
  },
  actions: {
    addPolygon(context, GeoJSON) {
      const asBBox = bbox(GeoJSON);
      context.commit('addToPolygons', {
        id: shortid(),
        geojson: GeoJSON,
        bbox: asBBox,
        bboxPolygon: bboxPolygon(asBBox),
      });
    },
    deletePolygon(context, id) {
      const pos = context.getters.getPolygonIds.indexOf(id);
      if (pos !== -1) {
        context.commit('deleteFromPolygons', pos);
      }
    },
    deleteAllPolygons(context) {
      context.commit('updatePolygons', []);
    },
  },
});

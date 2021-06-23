import Vue from 'vue';
import Vuex from 'vuex';
import shortid from 'shortid';
import area from '@turf/area';
import {processNumber} from 'number-helper-functions';
import bboxPolygon from '@turf/bbox-polygon';
import {getGeoJSONBBox} from 'bbox-helper-functions';
import VuexPersistence from 'vuex-persist';
import {parseFromWK} from 'wkt-parser-helper';

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
});

Vue.use(Vuex);

class FeatureCollection {
  constructor(features = []) {
    this.type = 'FeatureCollection';
    this.features = features;
  }
}

class Feature {
  constructor(geometry) {
    this.type = 'Feature';
    this.geometry = geometry;
    this.properties = {};
  }
}

class GeoJSONItem {

  /**
   * Creates an instance of WktItem
   * @param {geojson} geojson
   */
  constructor(geojson) {
    this.id = shortid();
    this.geojson = geojson;
    this.bbox = getGeoJSONBBox(geojson);
    this.bboxPolygon = bboxPolygon(this.bbox);
  }
}

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
      if (state.polygons.length > 0) {
        return getGeoJSONBBox(new FeatureCollection(state.polygons.map((d) => {
          if (d.geojson.type !== 'Feature') {
            return new Feature(d.geojson);
          } else {
            return d.geojson;
          }
        })));
      } else {
        return [];
      }
    },
    getFullBBoxPolygon(_, getters) {
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
    addPolygon(context, geojson) {
      context.commit('addToPolygons', new GeoJSONItem(geojson));
    },
    addWkt(context, wkt) {
      context.commit('addToPolygons', new GeoJSONItem(parseFromWK(wkt)));
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
  plugins: [vuexLocal.plugin],
});

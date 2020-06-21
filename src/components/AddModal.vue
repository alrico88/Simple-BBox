<template lang="pug">
  .container-fluid.modal-elem
    .row
      .col
        form.form
          .form-group
            label Choose a format
            br
            btn-group(:items="formats", v-model="format")
          .form-group
            label Paste or enter your text here
            textarea.form-control(v-model="text", rows="10", :class="{'is-invalid': error}")
          .form-group(v-if="error")
            .alert.alert-danger.border-danger
              | {{ error }}
          .form-group
            button.btn.btn-success(type="button", @click="processText", :disabled="!hasEnteredText") Add shape
</template>

<script>
import BtnGroup from './BtnGroup.vue';
import {parseFromWK} from 'wkt-parser-helper';
import store from '../store/index';

const formats = {
  GEOJSON: 'geojson',
  WKT: 'wkt',
};

export default {
  components: {
    BtnGroup,
  },
  data() {
    return {
      formats: [
        {
          value: 'geojson',
          text: 'GeoJSON',
        },
        {
          value: 'wkt',
          text: 'WKT',
        },
      ],
      format: 'geojson',
      text: '',
      error: null,
    };
  },
  computed: {
    hasEnteredText() {
      return this.text !== '';
    },
  },
  methods: {
    processText() {
      const {text, format} = this;
      let parsed;
      try {
        switch (format) {
          case formats.GEOJSON:
            parsed = JSON.parse(text);
            break;
          case formats.WKT:
            parsed = parseFromWK(text);
            break;
          default:
            throw new Error('invalid format');
        }
        if (parsed.type === 'FeatureCollection') {
          parsed.features.forEach((d) => {
            store.dispatch('addPolygon', d);
          });
        } else {
          store.dispatch('addPolygon', parsed);
        }

        this.$emit('close');
      } catch (err) {
        this.error = err;
      }
    },
  },
};
</script>

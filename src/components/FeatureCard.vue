<template lang="pug">
b-card.mb-2(no-body)
  b-card-header.p-2
    .row.align-items-center.py-1
      .col
        h5.mb-0 {{ polygon.id }}
      .col-4.text-right
        p.mb-0 {{ getPolygonArea(polygon.id) }}km2
  b-card-body.p-0.bg-white
    b-form-input.bg-white(readonly, type="text", v-model="text")
  b-card-footer.p-2
    b-button.mr-2(
      size="sm",
      variant="primary",
      v-clipboard:copy="text",
      v-clipboard:success="notifyClipSuccess",
      v-clipboard:error="notifyClipError"
    ) #[b-icon-clipboard] Copy to clipboard
    b-button.float-right(
      size="sm",
      variant="danger",
      @click="deletePolygon(polygon.id)"
    ) #[b-icon-trash] Remove
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import ClipboardMixin from '../mixins/ClipboardMixin';

export default {
  mixins: [ClipboardMixin],
  props: {
    polygon: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(['getPolygonArea']),
    text() {
      return JSON.stringify(this.polygon.bbox);
    },
  },
  methods: {
    ...mapActions(['deletePolygon']),
  },
};
</script>

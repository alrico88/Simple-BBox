<template lang="pug">
  .card.mb-2
    .card-header.p-2
      .row.align-items-center
        .col
          h5.mb-0
            | {{ polygon.id }}
        .col-4.text-right
          p.mb-0 {{ getPolygonArea(polygon.id) }}km2
    .card-body.p-2
      p.mb-0
        | {{ polygon.bbox }}
    .card-footer.p-2
      button.btn.btn-sm.btn-primary.mr-2(href="#", v-clipboard:copy="JSON.stringify(polygon.bbox)", v-clipboard:success="notifyClipSuccess", v-clipboard:error="notifyClipError")
        i.fa.fa-copy
        |  Copy to clipboard
      button.btn.btn-sm.btn-danger.float-right(href="#", @click.prevent="deletePolygon(polygon.id)")
        i.fa.fa-trash
        |  Remove
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import ClipboardMixin from '../mixins/clipboard';

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
  },
  methods: {
    ...mapActions(['deletePolygon']),
  },
};
</script>

<style>
</style>

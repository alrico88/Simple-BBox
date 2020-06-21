<template lang="pug">
  .col.maxHeight.border-left
    .row
      .col.pt-3
        h2 Simple BBox
    .row
      .col
        button.btn.btn-sm.btn-secondary.mb-2(type="button", @click="addManually")
          i.fa.fa-plus
          |  Add manually by text
        ZoomCenterTransition(:group="true", v-show="getPolygons.length > 0")
          feature-card(
            v-for="polygon of getPolygons",
            :polygon="polygon",
            :key="polygon.id"
          )
        .alert.alert-primary.border-primary(v-show="getPolygons.length === 0") Draw some shapes first!
        ZoomCenterTransition
          .alert.alert-primary.border-primary(v-show="getPolygons.length > 1")
            .row
              .col
                p.mb-2 Get BBox of all features
            .row
              .col
                button.btn.btn-sm.btn-primary.mr-2(v-clipboard:copy="JSON.stringify(getFullBBox)", v-clipboard:success="notifyClipSuccess", v-clipboard:error="notifyClipError")
                  i.fa.fa-copy
                  |  Copy to clipboard
        ZoomCenterTransition
          .alert.alert-danger.border-danger(v-show="getPolygons.length > 1")
            .row.align-items-center
              .col
                p.mb-0 Remove all drawn features at once
              .col-4.text-right
                button.btn.btn-sm.btn-danger(href="#", @click.prevent="removeAll")
                  i.fa.fa-trash
                  |  Remove
    hr.mt-0.mb-2
    author-info
</template>

<script>
import {mapGetters} from 'vuex';
import {ZoomCenterTransition} from 'vue2-transitions';
import {ruleOfThree} from 'math-helper-functions';
import AddModal from './AddModal.vue';
import FeatureCard from './FeatureCard.vue';
import ClipboardMixin from '../mixins/clipboard';
import AuthorInfo from './AuthorInfo.vue';

export default {
  components: {
    ZoomCenterTransition,
    FeatureCard,
    AuthorInfo,
  },
  mixins: [ClipboardMixin],
  computed: {
    ...mapGetters(['getPolygons', 'getFullBBox']),
  },
  methods: {
    removeAll() {
      this.$store.dispatch('deleteAllPolygons');
    },
    addManually() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.$dlg.modal(AddModal, {
        title: 'Add shape by text',
        width: ruleOfThree(100, width, 50),
        height: ruleOfThree(100, height, 50),
        params: {},
      });
    },
  },
};
</script>

<style scoped>
.maxHeight {
  max-height: 100vh;
  overflow-y: auto;
}
.smalltext {
  font-size: 14pt;
}
</style>

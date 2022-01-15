<template lang="pug">
.col.maxHeight.border-left.border-warning
  .row.bg-yellow.py-3.mb-3
    .col
      h2.text-yellow.mb-0 Simple BBox
  .row
    .col
      b-button.mb-3(
        variant="warning",
        type="button",
        @click="addManually",
        block
      ) #[b-icon-plus] Add shape manually
      ZoomCenterTransition(:group="true", v-show="getPolygons.length > 0")
        feature-card(
          v-for="polygon of getPolygons",
          :polygon="polygon",
          :key="polygon.id"
        )
      empty-state(:show="getPolygons.length === 0")
      ZoomCenterTransition
        b-alert.border-primary(
          variant="primary",
          :show="getPolygons.length > 1"
        )
          .row
            .col
              p.mb-2 Get BBox of all features
          .row
            .col
              b-button.mr-2(
                size="sm",
                variant="primary",
                v-clipboard:copy="JSON.stringify(getFullBBox)",
                v-clipboard:success="notifyClipSuccess",
                v-clipboard:error="notifyClipError"
              ) #[b-icon-clipboard] Copy to clipboard
      ZoomCenterTransition
        .alert.alert-danger.border-danger(v-show="getPolygons.length > 1")
          .row.align-items-center
            .col
              p.mb-0 Remove all drawn features at once
            .col-4.text-right
              b-button(size="sm", variant="danger", @click="removeAll") #[b-icon-trash] Remove
  hr.mt-0.mb-2
  author-info
  b-modal#manualAddModal(
    ref="manualAddModal",
    title="Add manually",
    ok-only,
    ok-title="Close",
    ok-variant="secondary"
  )
    add-manually(@done="closeAddModal")
</template>

<script>
import {mapGetters} from 'vuex';
import {ZoomCenterTransition} from 'vue2-transitions';
import AddManually from './AddManually.vue';
import FeatureCard from './FeatureCard.vue';
import ClipboardMixin from '../mixins/ClipboardMixin';
import AuthorInfo from './AuthorInfo.vue';
import EmptyState from './EmptyState.vue';

export default {
  components: {
    ZoomCenterTransition,
    FeatureCard,
    AuthorInfo,
    AddManually,
    EmptyState,
  },
  mixins: [ClipboardMixin],
  computed: {
    ...mapGetters(['getPolygons', 'getFullBBox']),
  },
  methods: {
    removeAll() {
      this.$store.dispatch('deleteAllPolygons');
    },
    closeAddModal() {
      this.$refs.manualAddModal.hide();
    },
    addManually() {
      this.$bvModal.show('manualAddModal');
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

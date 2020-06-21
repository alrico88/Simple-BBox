<!--
  - Copyright (c) 2020 Satya Insights S.L. - All Rights Reserved.
  - Unauthorized copying of this file, via any medium is strictly prohibited.
  - Proprietary and confidential.
  -->

<template lang="pug">
  .btn-group(role='group')
    button.btn.btn-sm.btn-secondary(
      v-for="item of items"
      type='button',
      v-bind:class="{active: selected === item.value}",
      v-on:click.prevent="selected = item.value"
    ) {{ item.text }}
    slot
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    value: {
      type: [Number, String],
      required: true,
    },
  },
  computed: {
    selected: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>

<style>
</style>

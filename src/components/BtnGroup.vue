<template lang="pug">
b-button-group.d-flex
  b-button.w-100(
    size="sm",
    variant="secondary",
    v-for="item of items",
    :key="item.value",
    v-bind:class="{ active: selected === item.value }",
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

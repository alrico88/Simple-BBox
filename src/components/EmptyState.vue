<template lang="pug">
b-alert.border-warning.bg-yellow.mb-0(variant='warning', :show='show') #[b-icon-brush] Draw or add some shapes first
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

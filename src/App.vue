<template>
  <div
    id="app"
    class="container-fluid"
  >
    <div class="row">
      <Map />
      <Result />
      <notifications group="clipboard" />
    </div>
  </div>
</template>

<script>
import Map from './components/Map.vue';
import Result from './components/Result.vue';

export default {
  name: 'App',
  components: {
    Map,
    Result,
  },
};
</script>

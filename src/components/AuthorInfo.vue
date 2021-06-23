<template lang="pug">
.row.pb-2
  .col
    p.mb-2 BBoxes are in the format
      code.ml-2 [minLon, minLat, maxLon, maxLat]
    .d-flex.justify-content-between.align-items-center
      div
        p.mb-0 #[b-icon-laptop] Made by #[a.font-weight-bold(href="https://alrico.es", target="_blank") Alberto Rico]
      div
        p.mb-0 Code on
          a.ml-2(
            href="https://github.com/alrico88/Simple-BBox",
            target="_blank"
          ) #[b-icon-github] Github
</template>

<script>
export default {};
</script>

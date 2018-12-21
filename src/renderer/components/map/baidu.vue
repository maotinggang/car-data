<template>
  <div>
    <baidu-map
      class="bm-view"
      :center="center"
      :zoom="zoom"
    >
    </baidu-map>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lng: 116.404, lat: 39.915 },
      zoom: 12
    };
  }
};
</script>

<style scoped>
.bm-view {
  width: 100%;
  height: 400px;
}
</style>
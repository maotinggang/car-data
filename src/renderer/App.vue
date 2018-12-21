<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "car-data-analyze"
};
</script>

<style>
/* CSS */
@import "~iview/dist/styles/iview.css";

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

#app {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
  width: 100vw;
}
</style>

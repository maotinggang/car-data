<template>
  <div>
    <div
      class="amap-wrapper"
      :style="height"
    >
      <el-amap
        class="amap-box"
        :vid="'amap-vue'"
      ></el-amap>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //   height: { height: window.innerHeight - 330 + "px" }
    };
  },
  methods: {
    resize() {
      console.log("resize");

      this.height = { height: window.innerHeight - 330 + "px" };
    }
  }
};
</script>

<style>
.amap-wrapper {
  /* position: relative; */
  height: 500px;
}
</style>
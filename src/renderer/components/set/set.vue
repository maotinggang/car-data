<template>
  <div>
    <load-file
      @input="track"
      placeholder="加载车辆轨迹文件"
    >车辆轨迹</load-file>
    {{test}}
    <load-file
      @input="speed"
      placeholder="加载车辆限速区域文件"
    >限速区域</load-file>
    <load-file
      @input="zone"
      placeholder="加载车辆越界区域文件"
    >越界区域</load-file>
    <Row>
      <Col
        :xs="10"
        :sm="14"
        :md="16"
        :lg="18"
      >
      <Input
        v-model="exspeed"
        placeholder="输入超速值，多个值用逗号分开"
        clearable
      >
      <span slot="prepend">超速限制</span>
      </Input>
      </Col>
    </Row>
  </div>
</template>

<script>
import LoadFile from "./file";
export default {
  data() {
    return {
      exspeed: "",
      test: ""
    };
  },
  components: {
    LoadFile
  },
  methods: {
    track(filename) {
      // let fileContent = [];
      console.log("test");
    },
    zone() {},
    speed() {}
  }
};
</script>

<style scoped>
</style>
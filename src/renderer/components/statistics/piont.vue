
<template>
  <div class="table">
    <Table
      :columns="columns"
      :height="windowHeight-120"
      :data="analyzeTable"
      size="small"
      highlight-row
    ></Table>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      columns: [
        {
          title: "序号",
          key: "no",
          width: 70,
          align: "center"
        },
        {
          title: "车牌",
          key: "id",
          width: 110,
          align: "center"
        },
        {
          title: "时间",
          key: "time",
          width: 150,
          align: "center"
        },
        {
          title: "状态",
          key: "state",
          width: 60,
          align: "center"
        },
        {
          title: "速度",
          key: "speed",
          width: 60,
          align: "center"
        },
        {
          title: "超速",
          key: "over",
          width: 80,
          align: "center"
        },
        {
          title: "卫星",
          key: "stano",
          width: 60,
          align: "center"
        },
        {
          title: "经度",
          key: "lng",
          minWidth: 100,
          align: "center"
        },
        {
          title: "纬度",
          key: "lat",
          minWidth: 100,
          align: "center"
        }
      ]
    };
  },
  computed: {
    ...mapState("statistics", ["analyzeTable"]),
    windowHeight() {
      return this.$store.state.list.windowHeight;
    }
  }
};
</script>

<style>
.table {
  overflow: auto;
}
</style>
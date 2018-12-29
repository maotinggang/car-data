
<template>
  <div class="table">
    <Table
      :columns="columns"
      :height="windowHeight-280"
      :data="selectList"
      size="small"
      highlight-row
      @on-row-dblclick="deviceClick"
    ></Table>
  </div>
</template>
<script>
import { EventBus } from "../../../../lib/event";
import { mapState } from "vuex";
export default {
  data() {
    return {
      columns: [
        {
          title: "序号",
          key: "no",
          width: 90,
          align: "center"
        },
        {
          title: "时间",
          key: "time",
          align: "center"
        },
        {
          title: "状态",
          key: "state",
          width: 60,
          align: "center"
        }
      ]
    };
  },
  created() {},
  computed: {
    ...mapState("history", ["selectList"]),
    windowHeight() {
      return this.$store.state.list.windowHeight;
    }
  },
  methods: {
    deviceClick(value) {
      EventBus.$emit("history-clicked", value);
    }
  }
};
</script>

<style>
.table {
  overflow: auto;
}
</style>
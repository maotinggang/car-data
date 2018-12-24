
<template>
  <Table
    :columns="columns"
    :data="selectList"
    size="small"
    highlight-row
    @on-row-dblclick="deviceClick"
  ></Table>
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
  computed: {
    ...mapState("record", ["selectList"])
  },
  methods: {
    deviceClick(value) {
      EventBus.$emit("record-clicked", value);
    }
  }
};
</script>

<style>
.ivu-table .table-cell {
  background-color: aqua;
}
.ivu-table th.table-column {
  background-color: aqua;
}
</style>
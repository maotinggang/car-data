<template>
  <div class="table">
    <Table
      :columns="columns"
      :height="windowHeight-340"
      :data="data"
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
          title: "参数",
          key: "param",
          width: 150
        },
        {
          title: "结果",
          key: "results"
        }
      ],
      data: [
        {
          param: "超速点数",
          results: "10"
        },
        {
          param: "超速次数",
          results: "10"
        },
        {
          param: "平均超速率",
          results: "13%"
        },
        {
          param: "最大超速率",
          results: "20%"
        },
        {
          param: "平均超速时间",
          results: "10秒"
        },
        {
          param: "最大超速时间",
          results: "33秒"
        },
        {
          param: "越界点数",
          results: "9"
        },
        {
          param: "越界次数",
          results: "2"
        },
        {
          param: "平均越界时间",
          results: "54"
        },
        {
          param: "最大越界时间",
          results: "10"
        }
      ]
    };
  },
  computed: {
    ...mapState("history", ["test"]),
    windowHeight() {
      return this.$store.state.list.windowHeight;
    }
  }
};
</script>

<style scoped>
.table {
  overflow: auto;
}
</style>



<template>
  <div>
    <Table
      :columns="columns"
      :height="windowHeight-160"
      :data="analyze100Table"
      ref="table"
      size="small"
      highlight-row
    ></Table>
    <Page
      class="page"
      :total="analyzeTable.length"
      show-elevator
      :page-size="100"
      show-total
      @on-change="onPageChange"
    />
  </div>
</template>
<script>
  import { EventBus } from "../../../lib/event";
  import { mapState, mapActions } from "vuex";
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
            title: "告警",
            key: "alert",
            width: 60,
            align: "center"
          },
          {
            title: "准确率",
            key: "estimate",
            width: 80,
            align: "center"
          },
          {
            title: "速度",
            key: "speed",
            width: 60,
            align: "center"
          },
          {
            title: "限速",
            key: "limit",
            width: 60,
            align: "center"
          },
          {
            title: "状态",
            key: "state",
            width: 70,
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
      ...mapState("statistics", ["analyzeTable", "analyze100Table"]),
      windowHeight() {
        return this.$store.state.list.windowHeight;
      }
    },
    created() {
      EventBus.$on("statistics-save", value => {
        this.$refs.table.exportCsv({
          filename: value.start
        });
      });
    },
    methods: {
      ...mapActions("statistics", ["analyzeTable100Action"]),
      onPageChange(page) {
        this.analyzeTable100Action(page);
      }
    }
  };
</script>

<style>
  .page {
    position: relative;
    padding: 3px;
  }
</style>
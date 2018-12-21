<template>
  <Table
    stripe
    :columns="columns"
    :data="data"
    size="small"
    border
    :show-header=false
  ></Table>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "参数",
          key: "param",
          width: 100
        },
        {
          title: "结果",
          key: "results"
        }
      ],
      data: [
        {
          param: "超速次数",
          results: "10"
        },
        {
          param: "越界次数",
          results: "0"
        }
      ]
    };
  }
};
</script>

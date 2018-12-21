
<template>
  <Table
    :columns="columns10"
    :data="data9"
    size="small"
  ></Table>
</template>
<script>
import expandRow from "./expand.vue";
export default {
  components: { expandRow },
  data() {
    return {
      columns10: [
        {
          type: "expand",
          width: 20,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            });
          }
        },
        {
          title: "序号",
          key: "no",
          width: 60,
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
      ],
      data9: [
        {
          no: 1,
          time: "20180502 12:05:30",
          state: "正常",
          job: "Data engineer",
          interest: "badminton",
          birthday: "1991-05-14",
          book: "Steve Jobs",
          movie: "The Prestige",
          music: "I Cry"
        },
        {
          time: "Jim Green",
          state: "正常",
          job: "Data Scientist",
          interest: "volleyball",
          birthday: "1989-03-18",
          book: "My Struggle",
          movie: "Roman Holiday",
          music: "My Heart Will Go On"
        },
        {
          time: "Joe Black",
          state: "正常",
          job: "Data Product Manager",
          interest: "tennis",
          birthday: "1992-01-31",
          book: "Win",
          movie: "Jobs",
          music: "Don’t Cry"
        },
        {
          time: "Jon Snow",
          state: "正常",
          job: "Data Analyst",
          interest: "snooker",
          birthday: "1988-7-25",
          book: "A Dream in Red Mansions",
          movie: "A Chinese Ghost Story",
          music: "actor"
        }
      ]
    };
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
<template>
  <div>
    <Tree
      ref="tree"
      :data="data"
      show-checkbox
      class="tree"
      @on-select-change="selected"
      @on-check-change="checked"
    ></Tree>
    <Spin
      size="large"
      fix
      v-if="loading"
    ></Spin>
  </div>
</template>
<script>
// import { mapState } from "vuex";
import { asyncSelectAll } from "../../../lib/maria";
export default {
  data() {
    return {
      loading: false
    };
  },
  created() {
    asyncSelectAll("car_info").then(data => {
      // store.dispatch("listInit", data);
      this.loading = false;
    });
  },
  methods: {
    selected(device) {
      if (device[0]) {
      }
    },
    checked(devices) {}
  },
  computed: {
    data() {
      // let devices = this.list;
      // console.log(JSON.stringify(devices));

      let children = [];
      // devices.foreach(element => {
      //   children.push({ title: element.name });
      // });
      return [
        {
          title: "",
          expand: true,
          children: children
        }
      ];
    }
  }
};
</script>

<style scoped>
.tree {
  text-align: left;
}
</style>

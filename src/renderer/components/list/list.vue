<template>
  <div>
    <Tree
      ref="tree"
      :data="data"
      show-checkbox
      class="tree"
      @on-select-change="onSelected"
      @on-check-change="onChecked"
    ></Tree>
    <Spin
      size="large"
      fix
      v-if="loading"
    ></Spin>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { asyncSelectAll } from "../../../lib/maria";
import array from "lodash/array";
import collection from "lodash/collection";
import { EventBus } from "../../../lib/event";
export default {
  data() {
    return {
      loading: false
    };
  },
  created() {
    asyncSelectAll("car_info").then(data => {
      this.listInit(data);
      this.loading = false;
    });
    window.onresize = () => {
      this.getWindowHeight(window.innerHeight);
    };
    window.onload = () => {
      this.getWindowHeight(window.innerHeight);
    };
  },
  methods: {
    ...mapActions("list", [
      "listInit",
      "deviceChecked",
      "deviceSelected",
      "getWindowHeight"
    ]),
    onSelected(device) {
      if (device[0]) {
        this.deviceSelected(device[0].title);
      }
      EventBus.$emit("device-selected", this.selected);
    },
    onChecked(devices) {
      let temp = [];
      collection.forEach(devices, value => {
        if (!value.children) {
          temp.push(value.title);
        }
      });
      this.deviceChecked(temp);
    }
  },
  computed: {
    ...mapState("list", ["list", "selected"]),
    data() {
      let devices = this.list;
      let companys = array.uniqBy(devices, "company");
      let children = [];
      for (let index = 0; index < companys.length; index++) {
        const company = companys[index].company;
        let temp = [];
        collection.forEach(devices, value => {
          if (value.company === company) {
            temp.push({ title: value.id });
          }
        });
        children.push({
          title: company,
          expand: false,
          children: temp
        });
      }
      return children;
    }
  }
};
</script>

<style scoped>
.tree {
  text-align: left;
}
</style>

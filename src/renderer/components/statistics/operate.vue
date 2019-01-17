<template>
  <Form
    :model="formItem"
    :label-width="60"
    label-position="left"
  >
    <FormItem
      label="查找车辆"
      style="margin:2px 2px;"
    >
      <Input
        v-model="formItem.id"
        size="small"
        clearable
        placeholder="输入完整车牌号"
      ></Input>
    </FormItem>
    </FormItem>
    <FormItem
      label="开始时间"
      style="margin:2px 2px;"
    >
      <DatePicker
        size="small"
        type="datetime"
        placeholder="选择查询开始时间"
        clearable
        v-model="formItem.datetime.start"
      ></DatePicker>
    </FormItem>
    <FormItem
      label="结束时间"
      style="margin:2px 2px;"
    >
      <DatePicker
        size="small"
        type="datetime"
        placeholder="选择查询结束时间"
        clearable
        v-model="formItem.datetime.end"
      ></DatePicker>
    </FormItem>
    <FormItem
      label="分析类型"
      style="margin:2px 2px;"
    >
      <Checkbox
        @on-change="onSpeed"
        :value="true"
      >超速</Checkbox>
      <Checkbox @on-change="onBorder">越界</Checkbox>
      <Checkbox @on-change="onZone">无域</Checkbox>
    </FormItem>
    <div style="margin:10px 0 10px 0;text-align: center;">
      <Button
        type="primary"
        size="small"
        ghost
        @click="onAnalyze"
      >分析</Button>
      <Button
        style="margin-left: 20px"
        type="primary"
        size="small"
        ghost
        @click="onDisplay"
      >显示</Button>
      <Button
        style="margin-left: 20px"
        type="success"
        size="small"
        ghost
        @click="onStatistics"
      >统计</Button>
      <Button
        style="margin-left: 20px"
        type="success"
        size="small"
        ghost
        @click="onSave"
      >保存</Button>
      <Button
        style="margin-left: 20px"
        type="warning"
        size="small"
        ghost
        @click="onClear"
      >清除</Button>
    </div>
  </Form>
</template>
<script>
import { EventBus } from "../../../lib/event";
import { mapActions } from "vuex";
import dateTime from "date-time";
import { multiCar, statistics } from "../../../lib/analyze";
export default {
  data() {
    return {
      formItem: {
        // TODO for test
        id: "渝TT92098",
        datetime: {
          start: "2018-01-01T00:00:00Z",
          end: "2018-02-01T00:00:00Z"
        }
      },
      analyzeNotice: false,
      analyzeData: ""
    };
  },
  created() {
    EventBus.$on("device-selected", value => {
      this.formItem.id = value;
    });
    EventBus.$on("statistics-analyze-notice", (desc, duration) => {
      this.$Notice.info({
        title: "分析车辆数据",
        desc: desc,
        duration: duration
      });
    });
    // 完成分析，显示结果
    EventBus.$on("statistics-analyze-done", value => {
      this.analyzeTableAction(value);
    });
  },
  methods: {
    ...mapActions("statistics", [
      "analyzeTableAction",
      "analyzeClear",
      "analyzeSpeed",
      "analyzeBorder",
      "analyzeZone"
    ]),
    isSelectCar() {
      if (!this.formItem.id) {
        this.$Message.error({
          content: "请选择车辆",
          duration: 3,
          closable: true
        });
        return false;
      }
      return true;
    },
    isSelectTime() {
      if (!this.formItem.datetime.start || !this.formItem.datetime.end) {
        this.$Message.error({
          content: "请选择操作时间段",
          duration: 3,
          closable: true
        });
        return false;
      }
      return true;
    },
    isDisplayTable() {
      if (!this.$store.state.statistics.analyzeTable[0]) {
        this.$Message.error({
          content: "请先加载显示列表",
          duration: 3,
          closable: true
        });
        return false;
      }
      return true;
    },
    onStatistics() {
      statistics(this.analyzeData);
    },
    onClear() {
      this.analyzeClear();
    },
    onSave() {
      EventBus.$emit("statistics-save", this.analyzeData);
    },
    onDisplay() {
      this.analyzeTableAction(this.analyzeData);
    },
    isCheckedDevice(id) {
      if (!id) {
        this.$Message.error({
          content: "请勾选待分析的车辆",
          duration: 3,
          closable: true
        });
        return false;
      }
      return true;
    },
    // 分析越界超速
    onAnalyze() {
      if (
        !this.isCheckedDevice(this.$store.state.list.checked[0]) ||
        !this.isSelectTime()
      ) {
        return;
      }
      this.analyzeData = {
        id: this.$store.state.list.checked,
        datetime: this.formItem.datetime,
        start: dateTime(),
        type: {
          speed: this.$store.state.statistics.analyzeSpeed,
          border: this.$store.state.statistics.analyzeBorder,
          zone: this.$store.state.statistics.analyzeZone
        }
      };
      multiCar(this.analyzeData);
    },
    // 选择需要分析的类型
    onSpeed(value) {
      this.analyzeSpeed(value);
    },
    onBorder(value) {
      this.analyzeBorder(value);
    },
    onZone(value) {
      this.analyzeZone(value);
    }
  }
};
</script>


<style scoped>
</style>
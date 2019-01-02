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
    <FormItem
      label="分析文件"
      style="margin:2px 2px;"
    >
      <load-file
        @input="formItem.file=$event"
        placeholder="分析结果保存到文件"
      >分析文件</load-file>
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
    </FormItem>
    <div style="margin:10px 0 10px 0;text-align: center;">
      <Button
        type="primary"
        size="small"
        ghost
        @click="onSelect"
      >查询</Button>
      <Button
        style="margin-left: 20px"
        type="success"
        size="small"
        ghost
        @click="onAnalyze"
      >分析</Button>
      <Button
        style="margin-left: 20px"
        type="success"
        size="small"
        ghost
        @click="onSave"
      >保存</Button>
      <Button
        style="margin-left: 20px"
        type="error"
        size="small"
        ghost
        @click="onClear"
      >清除</Button>
    </div>
  </Form>
</template>
<script>
import { asyncSelectCar } from "../../../lib/maria";
import { EventBus } from "../../../lib/event";
import LoadFile from "@/components/file";
import { mapActions } from "vuex";
import dateTime from "date-time";
import { multiCar } from "../../../lib/analyze";
export default {
  data() {
    return {
      formItem: {
        // TODO for test
        id: "渝TT92098",
        datetime: {
          start: "2018-01-01T00:00:00Z",
          end: "2018-01-01T01:00:00Z"
        },
        file:
          "C:/Users/mg/Documents/comnav/work/部标机车辆数据分析/数据/test.txt"
      },
      analyzeNotice: false
    };
  },
  components: {
    LoadFile
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
      "analyzeBorder"
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
    onSelect() {
      if (!this.isSelectCar()) return;
      if (!this.isSelectTime()) return;
      // 限制按时间24h进行查询，防止一次数据量过大
      if (
        this.formItem.datetime.end - this.formItem.datetime.start >
        24 * 60 * 60 * 1000
      ) {
        this.$Message.error({
          content: "暂支持查询24小时数据",
          closable: true
        });
        return;
      }
      let selectData = {
        id: this.formItem.id,
        datetime: {
          start: dateTime({ date: new Date(this.formItem.datetime.start) }),
          end: dateTime({ date: new Date(this.formItem.datetime.end) })
        }
      };
      asyncSelectCar(selectData)
        .then(result => {
          if (result[0]) {
            this.selectListAction(result);
          }
        })
        .catch(err => {
          this.$Message.error({
            content: "查询数据错误" + err,
            duration: 3,
            closable: true
          });
        });
    },
    onClear() {
      this.analyzeClear();
    },
    isSelectFile() {
      if (!this.formItem.file) {
        this.$Message.error({
          content: "请选择分析结果存储文件",
          duration: 3,
          closable: true
        });
        return false;
      }
      return true;
    },
    onSave() {
      if (!this.isSelectFile()) return;
      console.log("test");
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
      multiCar({
        id: this.$store.state.list.checked,
        datetime: this.formItem.datetime,
        file: this.formItem.file,
        start: dateTime(),
        type: {
          speed: this.$store.state.statistics.analyzeSpeed,
          border: this.$store.state.statistics.analyzeBorder
        }
      });
    },
    // 选择需要分析的类型
    onSpeed(value) {
      this.analyzeSpeed(value);
    },
    onBorder(value) {
      this.analyzeBorder(value);
    }
  }
};
</script>


<style scoped>
</style>
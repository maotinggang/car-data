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
      label="地图显示"
      style="margin:2px 2px;"
    >
      <CheckboxGroup
        v-model="formItem.zone"
        size="small"
        @on-change="onDisplay"
      >
        <Checkbox label="轨迹"></Checkbox>
        <Checkbox label="限速"></Checkbox>
        <Checkbox label="边界"></Checkbox>
      </CheckboxGroup>
    </FormItem>
    <FormItem
      label="数据筛选"
      style="margin:2px 2px;"
    >
      <CheckboxGroup
        v-model="formItem.filter"
        size="small"
        @on-change="onFilter"
      >
        <Checkbox label="正常"></Checkbox>
        <Checkbox label="超速"></Checkbox>
        <Checkbox label="越界"></Checkbox>
      </CheckboxGroup>
    </FormItem>
    <FormItem
      label="播放速度"
      style="margin:2px 2px;"
    >
      <Slider
        v-model="formItem.slider"
        :step="1"
        show-stops
        show-input
        input-size="small"
        @on-change="sliderChange"
        @on-input="sliderChange"
        :min=1
        :max=10
      ></Slider>
    </FormItem>
    <div style="margin:0 0 5px 0;text-align: center;">
      <Button
        type="primary"
        size="small"
        ghost
        @click="select"
      >查询</Button>
      <Button
        style="margin-left: 10px"
        type="error"
        size="small"
        ghost
        @click="clear"
      >清除</Button>
      <Button
        style="margin-left: 10px"
        type="success"
        size="small"
        ghost
        @click="analyze"
      >分析</Button>
      <Button
        style="margin-left: 40px"
        type="success"
        size="small"
        ghost
        @click="play"
      >播放</Button>
      <Button
        style="margin-left: 10px"
        type="warning"
        size="small"
        ghost
        @click="pause"
      >暂停</Button>
    </div>
  </Form>
</template>
<script>
import { asyncSelectCar } from "../../../../lib/maria";
import { EventBus } from "../../../../lib/event";
import { mapActions } from "vuex";
// import collection from "lodash/collection";
import dateTime from "date-time";
export default {
  data() {
    return {
      formItem: {
        id: "渝A0G096",
        datetime: {
          start: "2018-01-01T09:00:00Z",
          end: "2018-01-01T10:00:00Z"
        },
        select: "",
        zone: [],
        filter: ["正常", "超速", "越界"],
        slider: 1
      }
    };
  },
  created() {
    EventBus.$on("device-selected", value => {
      this.formItem.id = value;
    });
  },
  methods: {
    ...mapActions("record", [
      "selectList",
      "selectClear",
      "playSpeed",
      "display",
      "filter"
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
    select() {
      if (!this.isSelectCar()) return;
      let selectData = "";
      if (this.formItem.datetime.start && this.formItem.datetime.end) {
        selectData = {
          id: this.formItem.id,
          datetime: {
            start: dateTime({ date: new Date(this.formItem.datetime.start) }),
            end: dateTime({ date: new Date(this.formItem.datetime.end) })
          }
        };
      } else {
        this.$Message.error({
          content: "请选择查询时间，数据量较大，尽量选择较短时间段",
          duration: 3,
          closable: true
        });
        return;
      }
      asyncSelectCar(selectData)
        .then(result => {
          if (result[0]) {
            this.selectList(result);
            EventBus.$emit("record-select-done");
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
    clear() {
      this.selectClear();
      EventBus.$emit("record-clear");
    },
    play() {
      EventBus.$emit("record-play");
    },
    pause() {
      EventBus.$emit("record-pause");
    },
    analyze() {
      if (!this.isSelectCar()) return;
      let id = "渝A0G096";
      const msg = this.$Message.loading({
        content: "分析" + id + "数据中...",
        duration: 0
      });
      setTimeout(msg, 3000);
    },
    sliderChange(value) {
      this.playSpeed(value);
    },
    onDisplay(value) {
      if (!this.isSelectCar()) return;
      this.display(value);
    },
    onFilter(value) {
      if (!this.isSelectCar()) return;
      this.filter(value);
    }
  }
};
</script>


<style scoped>
</style>
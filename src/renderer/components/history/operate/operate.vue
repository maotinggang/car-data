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
      <Checkbox
        @on-change="onTrack"
        :value="true"
      >轨迹</Checkbox>
      <Checkbox @on-change="onSpeed">限速</Checkbox>
      <Checkbox @on-change="onBorder">边界</Checkbox>
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
        @click="onSelect"
      >查询</Button>
      <Button
        style="margin-left: 5px"
        type="error"
        size="small"
        ghost
        @click="onClear"
      >清除</Button>
      <Button
        style="margin-left: 5px"
        type="success"
        size="small"
        ghost
        @click="onAnalyze"
      >分析</Button>
      <Button
        style="margin-left: 30px"
        type="success"
        size="small"
        ghost
        @click="onPlay"
      >播放</Button>
      <Button
        style="margin-left: 5px"
        type="warning"
        size="small"
        ghost
        @click="onPause"
      >暂停</Button>
      <Button
        style="margin-left: 5px"
        type="warning"
        size="small"
        ghost
        @click="onStop"
      >刷新</Button>
    </div>
  </Form>
</template>
<script>
import { asyncSelectCar, asyncSelectZone } from "../../../../lib/maria";
import { EventBus } from "../../../../lib/event";
import { mapActions } from "vuex";
import collection from "lodash/collection";
import { gcj2bd } from "../../../../lib/coords";
import dateTime from "date-time";
import { historyAnalyze } from "../../../../lib/analyze";
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
        select: "",
        display: ["轨迹"],
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
    ...mapActions("history", [
      "selectListAction",
      "selectClear",
      "playSpeed",
      "displayTrack",
      "displaySpeed",
      "displayBorder"
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
            EventBus.$emit("history-select-done");
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
      this.selectClear();
      EventBus.$emit("history-clear");
    },
    onPlay() {
      EventBus.$emit("history-play");
    },
    onPause() {
      EventBus.$emit("history-pause");
    },
    onStop() {
      EventBus.$emit("history-stop");
    },
    // 分析越界超速
    onAnalyze() {
      if (!this.isSelectCar() || !this.isSelectTime()) {
        return;
      }
      this.$Notice.info({
        title: "开始分析车辆数据",
        desc: this.formItem.id,
        duration: 0
      });
      // TODO 分析查询数据
      historyAnalyze({
        id: this.$store.state.list.checked,
        datetime: this.formItem.datetime,
        file: this.formItem.file,
        start: dateTime()
      });
    },
    sliderChange(value) {
      this.playSpeed(value);
    },
    onTrack(value) {
      if (!this.isSelectCar()) return;
      this.displayTrack(value);
    },
    onSpeed(value) {
      if (!this.isSelectCar()) return;
      if (!value) {
        this.displaySpeed([]);
        return;
      }
      asyncSelectZone({ id: this.formItem.id, type: "限速" })
        .then(result => {
          if (result[0]) {
            let speed = [];
            let colorIndex = 0;
            let color = ["red", "blue", "yellow", "violet", "salmon", "sienna"];
            collection.forEach(result, value => {
              let one = {
                id: value.id,
                speed: value.speed,
                type: value.type,
                name: value.name,
                color: color[colorIndex++],
                polygonPath: []
              };
              let lng = value.lng.split(",");
              let lat = value.lat.split(",");
              for (let index = 0; index < lng.length; index++) {
                let coord = gcj2bd(lat[index], lng[index]);
                one.polygonPath.push({
                  lng: coord[1],
                  lat: coord[0]
                });
              }
              speed.push(one);
            });
            this.displaySpeed(speed);
          }
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    },
    onBorder(value) {
      if (!this.isSelectCar()) return;
      if (!value) {
        this.displayBorder([]);
        return;
      }
      asyncSelectZone({ id: this.formItem.id, type: "越线" })
        .then(result => {
          if (result[0]) {
            let border = [];
            let colorIndex = 0;
            let color = ["blue", "red", "yellow", "violet", "salmon", "sienna"];
            collection.forEach(result, (value, index) => {
              let one = {
                id: value.id,
                name: value.name,
                type: value.type,
                color: color[colorIndex++],
                polygonPath: []
              };
              let lng = value.lng.split(",");
              let lat = value.lat.split(",");
              for (let index = 0; index < lng.length; index++) {
                let coord = gcj2bd(lat[index], lng[index]);
                one.polygonPath.push({
                  lng: coord[1],
                  lat: coord[0]
                });
              }
              border.push(one);
            });
            this.displayBorder(border);
          }
        })
        .catch(err => {
          console.log(JSON.stringify(err));
        });
    }
  }
};
</script>


<style scoped>
</style>
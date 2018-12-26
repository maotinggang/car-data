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
      label="数据筛选"
      style="margin:2px 2px;"
    >
      <Checkbox
        @on-change="onNormal"
        :value="true"
      >正常</Checkbox>
      <Checkbox
        @on-change="onOverSpeed"
        :value="true"
      >超速</Checkbox>
      <Checkbox
        @on-change="onOverBorder"
        :value="true"
      >越界</Checkbox>
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
import LoadFile from "../file";
import { mapActions } from "vuex";
import collection from "lodash/collection";
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
        display: ["轨迹"],
        filter: ["正常", "超速", "越界"],
        slider: 1,
        file: ""
      }
    };
  },
  components: {
    LoadFile
  },
  created() {
    EventBus.$on("device-selected", value => {
      this.formItem.id = value;
    });
  },
  methods: {
    ...mapActions("record", [
      "selectListAction",
      "selectClear",
      "playSpeed",
      "displayTrack",
      "displaySpeed",
      "displayBorder",
      "filterNormal",
      "filterOverSpeed",
      "filterOverBorder"
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
    onSelect() {
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
          // FIXME 点击一次数据库查询无法返回结果,可能是数据库连接后为关闭造成
          if (result[0]) {
            this.selectListAction(result);
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
    onClear() {
      this.selectClear();
      EventBus.$emit("record-clear");
    },
    onPlay() {
      EventBus.$emit("record-play");
    },
    onPause() {
      EventBus.$emit("record-pause");
    },
    onStop() {
      EventBus.$emit("record-stop");
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
    onAnalyze() {
      if (!this.isSelectCar() || !this.isSelectFile()) return;
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
                one.polygonPath.push({
                  lng: lng[index],
                  lat: lat[index]
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
                // TODO 坐标转换
                one.polygonPath.push({
                  lng: lng[index],
                  lat: lat[index]
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
    },
    onNormal(value) {
      if (!this.isSelectCar()) return;
      this.displayBorder(value);
    },
    onOverSpeed(value) {
      if (!this.isSelectCar()) return;
      this.displayBorder(value);
    },
    onOverBorder(value) {
      if (!this.isSelectCar()) return;
      this.displayBorder(value);
    }
  }
};
</script>


<style scoped>
</style>
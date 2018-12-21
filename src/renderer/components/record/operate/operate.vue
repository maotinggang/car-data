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
      label="区域显示"
      style="margin:2px 2px;"
    >
      <CheckboxGroup
        v-model="formItem.checkbox"
        size="small"
      >
        <Checkbox label="限速"></Checkbox>
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
import dateTime from "date-time";
export default {
  data() {
    return {
      formItem: {
        id: "",
        datetime: { start: "", end: "" },
        select: "",
        checkbox: [],
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
    ...mapActions("record", ["selectList", "selectClear", "playSpeed"]),
    select() {
      if (!this.formItem.id) {
        this.$Message.error({
          content: "请选择查询设备",
          duration: 3,
          closable: true
        });
        return;
      }
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
          this.selectList(result);
        })
        .catch(err => {
          console.log(err);
        });
    },
    clear() {
      this.selectClear();
    },
    play() {
      EventBus.$emit("record-play");
    },
    pause() {
      EventBus.$emit("record-pause");
    },
    sliderChange() {
      this.playSpeed(this.formItem.slider);
    }
  }
};
</script>


<style scoped>
</style>
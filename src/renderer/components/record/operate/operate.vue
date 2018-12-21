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
        v-model="formItem.datetime.start"
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
        :min=1
        :max=10
      ></Slider>
    </FormItem>
    <div style="margin:0 0 5px 0;text-align: center;">
      <Button
        type="primary"
        size="small"
        ghost
      >查询</Button>
      <Button
        style="margin-left: 10px"
        type="error"
        size="small"
        ghost
      >清除</Button>
      <Button
        style="margin-left: 40px"
        type="success"
        size="small"
        ghost
      >播放</Button>
      <Button
        style="margin-left: 10px"
        type="warning"
        size="small"
        ghost
      >暂停</Button>
    </div>
  </Form>
</template>
<script>
export default {
  data() {
    return {
      formItem: {
        input: "",
        select: "",
        radio: "male",
        checkbox: [],
        switch: true,
        datetime: { start: "", end: "" },
        time: "",
        slider: 1,
        textarea: ""
      }
    };
  }
};
</script>


<style scoped>
</style>
<template>
  <Form :model="formItem" :label-width="60" label-position="left">
    <FormItem label="查找车辆" style="margin:2px 2px;">
      <Input v-model="formItem.id" size="small" clearable placeholder="输入完整车牌号"></Input>
    </FormItem>
    <FormItem label="开始时间" style="margin:2px 2px;">
      <DatePicker
        size="small"
        type="datetime"
        placeholder="选择查询开始时间"
        clearable
        v-model="formItem.datetime.start"
      ></DatePicker>
    </FormItem>
    <FormItem label="结束时间" style="margin:2px 2px;">
      <DatePicker
        size="small"
        type="datetime"
        placeholder="选择查询结束时间"
        clearable
        v-model="formItem.datetime.end"
      ></DatePicker>
    </FormItem>
    <FormItem label="分析类型" style="margin:2px 2px;">
      <Checkbox @on-change="onSpeed" :value="true">超速</Checkbox>
      <Checkbox @on-change="onBorder">越界</Checkbox>
      <Checkbox @on-change="onZone">无域</Checkbox>
    </FormItem>
    <div style="margin:10px 0 10px 0;text-align: center;">
      <Button style="width:65px;" type="primary" size="small" ghost @click="onAnalyze">分析</Button>
      <Button
        style="margin-left: 20px;width:65px;"
        type="primary"
        size="small"
        ghost
        @click="onDisplay"
      >加载</Button>
      <Button
        style="margin-left: 20px;width:65px;"
        type="warning"
        size="small"
        ghost
        @click="onStatistics"
      >统计</Button>
    </div>
    <FormItem label="结果编号" style="margin:2px 2px;">
      <Input v-model="formItem.analyzeId" size="small" clearable placeholder="此次分析数据编号，用于查询分析数据"></Input>
    </FormItem>
    <div style="margin:10px 0 10px 0;">
      <Upload action="#" multiple :before-upload="onSaveAll" class="upload">
        <Button style="width:65px;" type="info" size="small" ghost>保存全部</Button>
      </Upload>
      <Button
        style="width:65px;margin-left: 20px;"
        type="info"
        size="small"
        ghost
        @click="onSave"
      >保存显示</Button>
      <Button
        style="margin-left: 20px;width:65px;"
        type="error"
        size="small"
        ghost
        @click="onClear"
      >清除数据</Button>
    </div>
  </Form>
</template>
<script src="./operate.js"></script>
<style scoped>
  .upload {
    float: left;
    margin-left: 45px;
  }
</style>
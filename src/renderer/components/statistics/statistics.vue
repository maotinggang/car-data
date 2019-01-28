<template>
  <div class="layout">
    <Layout>
      <Content style="text-align: center;">
        <Card :padding="2">
          <p slot="title">告警点详情表</p>
          <point></point>
        </Card>
      </Content>
      <Sider class="layout-sider" :width="330">
        <Card :padding="2">
          <operate></operate>
        </Card>
        <Card :padding="0" style="text-align: center;">
          <p slot="title">统计结果</p>
          <results></results>
        </Card>
      </Sider>
    </Layout>
  </div>
</template>
<script>
  import Operate from "./operate.vue";
  import Point from "./point.vue";
  import Results from "./results.vue";
  export default {
    components: {
      Operate,
      Point,
      Results
    }
  };
</script>
<style scoped>
  .layout {
    background: white;
    position: fixed;
    width: 100%;
    padding-right: 498px;
    top: 64px;
    bottom: 0;
    overflow: hidden;
  }
  .layout-sider {
    background: white;
    position: fixed;
    top: 64px;
    right: 0;
    bottom: 0;
  }
</style>
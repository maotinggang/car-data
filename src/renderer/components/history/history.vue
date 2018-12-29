<template>
  <div class="layout">
    <Layout>
      <Content>
        <baidu></baidu>
      </Content>
      <Sider
        class="layout-sider"
        :width=330
      >
        <Card
          :padding=4
          :bordered=false
        >
          <operate></operate>
        </Card>
        <Card
          :padding=2
          class="operate"
        >
          <point></point>
        </Card>
      </Sider>
    </Layout>
  </div>
</template>
<script>
import { Baidu } from "@/components/map";
import Operate from "./operate";
import Point from "./point";
export default {
  components: {
    Baidu,
    Operate,
    Point
  }
};
</script>
<style scoped>
.layout {
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
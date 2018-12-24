<template>
  <div class="layout">
    <Sider
      :style="{position: 'fixed', height: '100vh', left: 0, overflow: 'auto'}"
      class="layout-sider"
      :width=160
    >
      <Card
        :padding=0
        :bordered=false
      >
        <p
          slot="title"
          :style="{textAlign: 'center'}"
        >车辆列表</p>
        <list></list>
      </Card>
    </Sider>
    <Layout :style="{marginLeft: '160px',marginRight: '330px'}">
      <Content>
        <Row>
          <Col>
          <Card :padding=3>
            <p
              slot="title"
              :style="{textAlign: 'center'}"
            >统计分析</p>
            <results></results>
          </Card>
          </Col>
        </Row>
        <Row>
          <Card :padding=3>
            <baidu></baidu>
          </Card>
        </Row>
      </Content>
    </Layout>
    <Sider
      class="layout-sider-record"
      :width=330
    >
      <Card
        :padding=0
        :bordered=false
      >
        <p
          slot="title"
          :style="{textAlign: 'center'}"
        >数据记录</p>
        <record></record>
      </Card>
    </Sider>
  </div>
</template>
<script>
import Baidu from "@/components/map";
import List from "@/components/list";
import Record from "@/components/record";
import Results from "@/components/results";
export default {
  components: {
    Baidu,
    List,
    Record,
    Results
  }
};
</script>
<style scoped>
.layout {
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-sider {
  background: white;
}
.layout-sider-record {
  background: white;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
}
.layout-card {
  padding: 0px;
}
.layout-content {
  overflow: hidden;
}
</style>
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
    <Sider
      :style="{position: 'fixed', height: '100vh', right: 0, overflow: 'auto'}"
      class="layout-sider"
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
    <Layout :style="{marginLeft: '160px',marginRight: '330px'}">
      <Content :style="{padding: '2px'}">
        <Row>
          <Card :padding=5>
            <baidu></baidu>
          </Card>
        </Row>
        <Row>
          <Col span="12">
          <Card :padding=5>
            <p
              slot="title"
              :style="{textAlign: 'center'}"
            >参数配置</p>
            <set></set>
          </Card>
          </Col>
          <Col span="12">
          <Card :padding=5>
            <p
              slot="title"
              :style="{textAlign: 'center'}"
            >结果展示</p>
            <results></results>
          </Card>
          </Col>
        </Row>
      </Content>
    </Layout>

  </div>
</template>
<script>
import Baidu from "@/components/map";
import List from "@/components/list";
import Record from "@/components/record";
import Set from "@/components/set";
import Results from "@/components/results";
export default {
  components: {
    Baidu,
    List,
    Record,
    Set,
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
.layout-card {
  padding: 0px;
}
.layout-content {
  overflow: hidden;
}
</style>
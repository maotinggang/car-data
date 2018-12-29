<template>
  <div class="layout">
    <Layout>
      <Header class="layout-header">
        <menu-all></menu-all>
      </Header>
      <Sider
        class="layout-sider"
        :width=170
      >
        <Card
          :padding=0
          :bordered=false
        >
          <list></list>
        </Card>
      </Sider>
      <Content class="layout-content">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </Content>
    </Layout>
  </div>
</template>
<script>
import List from "@/components/list";
import MenuAll from "@/components/menu";
export default {
  components: {
    List,
    MenuAll
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
  position: fixed;
  background: white;
  overflow: auto;
  top: 64px;
  bottom: 0;
}
.layout-header {
  position: fixed;
  background-color: white;
  width: 100%;
  height: 64px;
  padding: 0;
}
.layout-content {
  position: fixed;
  border: 1px solid #d7dde4;
  background-color: white;
  width: 100%;
  top: 64px;
  bottom: 0px;
  margin-left: 170px;
  overflow: hidden;
}
</style>
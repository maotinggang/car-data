<template>
  <div>
    <Menu
      mode="horizontal"
      active-name="1"
    >
      <div class="logo">
        <img
          class="img"
          src="@/assets/logo.png"
          alt="logo"
        >
      </div>
      <span class="name">车辆定位数据分析平台</span>
      <div>
        <MenuItem
          name="1"
          to="history"
        >
        <Icon type="md-time" />
        历史查询
        </MenuItem>
        <MenuItem
          name="2"
          to="statistics"
        >
        <Icon type="md-stats" />
        统计分析
        </MenuItem>
      </div>
    </Menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {}
};
</script>

<style scoped>
.logo {
  position: relative;
  float: left;
  margin-left: 10px;
}
.img {
  margin-top: 10px;
  height: 40px;
}
.menu-set {
  position: absolute;
  right: 100px;
}
.name {
  font-size: 17px;
  float: left;
  margin-left: 10px;
  margin-right: 10px;
  font-weight: 600;
}
</style>
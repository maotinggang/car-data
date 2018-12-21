<template>
  <div>
    <Row class="expand-row">
      <Col span="12">
      <span class="expand-key">经度: </span>
      <span class="expand-value">{{ row.lng }}</span>
      </Col>
      <Col span="12">
      <span class="expand-key">纬度: </span>
      <span class="expand-value">{{ row.lat }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
      <span class="expand-key">速度: </span>
      <span class="expand-value">{{ row.speed }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">方向: </span>
      <span class="expand-value">{{ row.direction }}</span>
      </Col>
      <Col span="8">
      <span class="expand-key">卫星: </span>
      <span class="expand-value">{{ row.stano }}</span>
      </Col>
    </Row>
  </div>
</template>
<script>
export default {
  props: {
    row: Object
  }
};
</script>
<style scoped>
.expand-row {
  margin-bottom: 5px;
}
</style>
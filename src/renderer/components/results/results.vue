<template>
  <div>
    <Card :padding=0>
      <p
        slot="title"
        :style="{textAlign: 'center'}"
      >统计结果</p>
      <Row>
        <Col span="12">
        <Card :bordered=false>
          <p>超速点数：10</p>
          <p>超速次数：10</p>
          <p>最大超速速度：10km/h</p>
          <p>平均超速速度：1km/h</p>
          <p>最长超速时间：10s</p>
          <p>平均超速时间：1km/h</p>
        </Card>
        </Col>
        <Col span="12">
        <Card :bordered=false>
          <p>越界点数：10</p>
          <p>越界次数：10</p>
          <p>最长越界时间：10s</p>
          <p>平均越界时间：10s</p>
        </Card>
        </Col>
      </Row>
    </Card>

  </div>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          title: "超速",
          key: "param",
          width: 100
        },
        {
          title: " ",
          key: "results"
        },
        {
          title: "越界",
          key: "param",
          width: 100
        },
        {
          title: " ",
          key: "results"
        }
      ],
      data: [
        {
          param: "点数",
          results: "10"
        },
        {
          param: "次数",
          results: "10"
        },
        {
          param: "最大速度",
          results: "10"
        },
        {
          param: "点数",
          results: "0"
        },
        {
          param: "次数",
          results: "0"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>


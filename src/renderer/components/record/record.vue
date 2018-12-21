<template>
  <div>
    <Card :padding=2>
      <operate></operate>
    </Card>
    <Card
      :padding=2
      class="operate"
    >
      <point></point>
    </Card>
  </div>
</template>

<script>
import Point from "./point";
import Operate from "./operate";
export default {
  components: {
    Point,
    Operate
  }
};
</script>

<style scoped>
</style>
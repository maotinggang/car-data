<template>
  <div>
    <Row :gutter="4">
      <Col
        :xs="10"
        :sm="14"
        :md="16"
        :lg="18"
      >
      <Input
        v-model="filename"
        :placeholder="placeholder"
        clearable
        @input="$emit('input',filename)"
      >
      <span slot="prepend">
        <slot></slot>
      </span>
      </Input>
      </Col>
      <Col>
      <Upload
        action="#"
        multiple
        :before-upload="handleUpload"
      >
        <Button icon="md-arrow-round-up">选择</Button>
      </Upload>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入"
    }
  },
  data() {
    return {
      filename: ""
    };
  },
  methods: {
    handleUpload(file) {
      this.filename = file.path;
      this.$emit("input", this.filename);
      return false;
    }
  }
};
</script>

<style scoped>
</style>
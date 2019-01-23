
<template>
  <div>
    <Upload action="#" multiple :before-upload="handleUpload" style="float:right">
      <Button icon="md-arrow-round-up" size="small">选择</Button>
    </Upload>
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
    methods: {
      handleUpload(file) {
        this.$emit("filename", file.path);
        return false;
      }
    }
  };
</script>

<style scoped>
</style>
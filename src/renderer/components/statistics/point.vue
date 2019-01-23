
<template>
  <div>
    <Table
      :columns="columns"
      :height="windowHeight-160"
      :data="analyze100Table"
      ref="table"
      size="small"
      highlight-row
    ></Table>
    <Page
      class="page"
      :total="analyzeTable.length"
      show-elevator
      :page-size="100"
      show-total
      @on-change="onPageChange"
    />
  </div>
</template>
<script src="./point.js"></script>
<style>
  .page {
    position: relative;
    padding: 3px;
  }
</style>
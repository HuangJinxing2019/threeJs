<template>
  <div class="header">
    <img class="bg" src="/public/images/title.png" alt="">
    <h1>智慧城市</h1>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
  .header{
    pointer-events: none;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 50px;
    text-align: center;
    color: #fff;
    h1{
      margin: 10px;

    }
    .bg{
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
    }
  }
</style>
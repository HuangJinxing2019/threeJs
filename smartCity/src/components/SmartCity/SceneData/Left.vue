<template>
  <div class="left">
    <ul class="list">
      <img class="line" src="/public/images/line_img.png">
      <li class="list-item" v-for="item of cityStore.infoList" :key="item.id">
        <img class="bg" src="/public/images/img.png">
        <div class="name">{{item.name}}</div>
        <div class="info">
          <img src="/public/images/bar.svg" style="width: 40px">
          <div>{{item.value}} <span class="unit">{{item.unit}}</span></div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
  import {useCityStore} from "../../../stores/city.js";
  const cityStore = useCityStore();
</script>

<style scoped lang="scss">
.left {
  pointer-events: none;
  position: fixed;
  top: 50px;
  z-index: 2;
  left: 0;
  .list {
    width: 260px;
    padding: 20px;
    color: #fff;
    .line{
      position: absolute;
      right: 0;
      height: 100%;
    }
    .list-item {
      position: relative;
      padding: 20px;
      .bg{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      &:not(:last-child) {
        margin-bottom: 20px;
      }

      .name {
        font-weight: bold;
      }

      .info {
        display: flex;
        justify-content: space-between;
        align-content: center;
        line-height: 40px;
        margin-top: 10px;
        font-size: 32px;
        font-weight: bold;

        .unit {
          font-weight: normal;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
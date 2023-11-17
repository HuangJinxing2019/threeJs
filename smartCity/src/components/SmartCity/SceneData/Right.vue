<template>
  <div class="right">
    <ul class="list">
      <img class="line" src="/public/images/line_img.png">
      <li
          class="list-item"
          :class="{ active: cityStore.currentId === item.id }"
          v-for="item of cityStore.eventList" :key="item.id"
          @click="selectHandle(item.id)"
      >
        <img class="bg" src="/public/images/img.png">
        <div class="info">
          <div class="name">{{item.info.name}}</div>
          <div class="time">{{item.uTime}}</div>
        </div>
        <div class="remark">
          <div>{{item.info.remark}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script setup>
import {useCityStore} from "../../../stores/city.js";

const cityStore = useCityStore();
const selectHandle = (id) => {
  cityStore.setCurrentId(id)
  cityStore.spriteMesh.forEach(mesh => {
    if(mesh.name === id){
      cityStore.updateTargetAndLookAt(mesh.position)
    }
  })
}
</script>

<style scoped lang="scss">
  .right{
    pointer-events: none;
    position: fixed;
    top: 50px;
    right: 0;
    z-index: 2;
    .list {
      width: 260px;
      padding: 20px;
      color: #fff;
      .line{
        position: absolute;
        left: 0;
        height: 100%;
      }
      .list-item {
        pointer-events: auto;
        position: relative;
        padding: 20px;
        &.active{
          color: red;
        }
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
        .info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: bold;
          .name{
            font-weight: bold;
            font-size: 18px;
          }
          .time{
            font-size: 12px;
          }
        }
        .remark{
          margin-top: 10px;
          font-size: 14px;
        }
      }
    }
  }
</style>
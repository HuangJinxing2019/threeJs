<template>
  <div>
    <SmartCity />
    <SmartData />
  </div>
</template>
<script setup>
  import SmartCity from "./components/SmartCity/index.vue";
  import { useCityStore } from "./stores/city.js";
  import {onMounted} from "vue";
  import SmartData from './components/SmartCity/SceneData/index.vue';

  const cityStore = useCityStore();
  const getData = () => {
    cityStore.getInfoList();
    cityStore.getEventList();
  }
  onMounted(() => {
    getData();
    setInterval(() => {
      getData();
    }, 60000)
  })
</script>

<style lang="scss" scoped>

</style>

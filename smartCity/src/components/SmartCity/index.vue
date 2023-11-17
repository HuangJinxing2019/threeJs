<template>
  <div class="city-screen" ref="cityScene"></div>
</template>

<script setup>
  import {ref, onMounted, watch} from "vue";
  import { useBasicScene } from '@/hooks/three'
  import useCity from "./hooks/useCityHook.js";
  import {useCityStore} from "../../stores/city.js";

  const cityStory = useCityStore();

  const cityScene = ref(null)
  const [scene, {render, camera, orbitControls }] = useBasicScene({cameraPosition: {x: 0, y: 7, z: 15}});

  cityStory.setOrbitControls(orbitControls);
  cityStory.setCamera(camera);

  const {
    flyLineAdd,
    lightWellAdd,
    radarAdd,
    spriteAdd,
    cleanAll
  } = useCity(scene, camera);

  const updateChange = () => {
    cityStory.eventList.forEach(item => {
      spriteAdd(item.option, item.info.icon, item.id)
      switch (item.info.name){
        case '火警':
          lightWellAdd(item.option);
          break;
        case '电力':
          radarAdd(item.option);
          break;
        case '治安':
          flyLineAdd(item.option);
          break;
        default:
          break;
      }
    })
  }

  watch(() => cityStory.eventList, () => {
    cityStory.setCurrentId(null);
    cityStory.clearSpriteMesh();
    cleanAll();
    updateChange()
  }, {immediate: true})


  onMounted(() => {
    render(cityScene.value);
  })
</script>

<style lang="scss" scoped>
.city-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
}

</style>

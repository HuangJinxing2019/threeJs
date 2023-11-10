<template>
  <div class="city-screen" ref="cityScene"></div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useBasicScene } from '@/hooks/three'
  import useCity from "./useCityHook.js";
  const cityScene = ref(null)
  const [scene, { render }] = useBasicScene({ cameraPosition: { x: 0, y: 7, z: 15 } });
  useCity(scene);

  onMounted(() => {
    render(cityScene.value);
  })
</script>

<style lang="scss" scoped>
.city-screen{
  width: 100vw;
  height: 100vh;
}

</style>

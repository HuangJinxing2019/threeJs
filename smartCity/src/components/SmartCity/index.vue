<template>
  <div class="city-screen" ref="cityScene"></div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { useBasicScene } from '@/hooks/three'
  const cityScene = ref(null)
  const [scene, { render }] = useBasicScene();
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

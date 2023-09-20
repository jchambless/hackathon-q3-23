<template>
  <div id="game">
    <p v-if="loading">Loading...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Game } from 'phaser';
import { launch } from '@/game/game.js';

const loading = ref(true);

onMounted(() => {
  launch()
    .then((game: Game) => {
      loading.value = false;
    }).catch(() => {});
})
</script>

<style scoped>
#game {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>
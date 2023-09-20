<script setup lang="ts">
import { ref } from 'vue'
import { IonButton } from '@ionic/vue';
import { launch } from '@/game/game.js';

const showButton = ref(true)

function handleClickStart() {
  showButton.value = false;
  launch();
}
</script>

<template>
  <div id="game">
    <ion-button v-if="showButton" @click="handleClickStart">HONK</ion-button>
  </div>
</template>

<style scoped>
#game {
height: 100%;
display: flex;
justify-content: center;
align-items: center;
margin: 0;
}
</style>
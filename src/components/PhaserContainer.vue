<script setup lang="ts">
import { ref } from 'vue'
import { IonImg } from '@ionic/vue';
import { launch } from '@/game/game.js';
import gooseTitle from '@/../public/assets/gooseTitle.gif';
import honkPlayButton from '@/../public/assets/honkPlayButton.gif';
import condensedBackground from '@/../public/assets/condensedBackground.png';
import gooseHonkEffect from '@/../public/assets/soundEffects/gooseHonkEffect1.mp3';

const showTitle = ref(true)
const launchSound = new Audio(gooseHonkEffect);

function handleClickStart() {
  launchSound.play();
  showTitle.value = false;
  launch();
}
</script>

<template>
  <div id="game" :style="{ backgroundImage: `url(${condensedBackground})` }">
      <ion-img 
        v-if="showTitle"
        :src=gooseTitle
        alt="ion goose logo"
      ></ion-img>
    <ion-img
        class="play-button"
        v-if="showTitle"
        :src=honkPlayButton
        alt="play button"
        @click="handleClickStart"
      ></ion-img>
  </div>
</template>

<style scoped>
#game {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 0;
  background-size: cover;
  background-position: center;
}

#game ion-img,
#game ion-button {
  display: block;
}

.play-button {
  cursor: pointer;
  margin-top: 60px;
}

</style>
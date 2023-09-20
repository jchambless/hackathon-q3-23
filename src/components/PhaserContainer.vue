<script setup lang="ts">
import { ref } from 'vue'
import { IonButton, IonImg, IonContent } from '@ionic/vue';
import { launch } from '@/game/game.js';
import gooseTitle from '@/../public/assets/gooseTitle.gif';
import honkPlayButton from '@/../public/assets/honkPlayButton.gif';

const showTitle = ref(true)

function handleClickStart() {
  this.sound.play(key);
  showTitle.value = false;
  launch();
}
</script>

<template>
  <div id="game">
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
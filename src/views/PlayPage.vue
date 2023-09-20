<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <PhaserContainer />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent } from '@ionic/vue';
import PhaserContainer from '@/components/PhaserContainer.vue'
</script>
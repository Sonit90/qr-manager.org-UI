<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNotifications from '@/components/layout/AppNotifications.vue'
import ConsentBanner from '@/components/ConsentBanner.vue'
</script>

<template>
  <v-app>
    <v-main>
      <RouterView />
      <AppNotifications />
      <ConsentBanner />
    </v-main>
  </v-app>
</template>

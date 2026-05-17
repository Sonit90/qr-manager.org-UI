<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNotifications from '@/components/layout/AppNotifications.vue'
</script>

<template>
  <v-app>
    <v-main>
      <RouterView />
      <AppNotifications />
    </v-main>
  </v-app>
</template>

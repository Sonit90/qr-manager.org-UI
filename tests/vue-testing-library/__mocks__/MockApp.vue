<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Notifications as NotificationComponent } from '@kyvg/vue3-notification'
</script>

<template>
  <v-app>
    <v-main>
      <RouterView />
      <NotificationComponent />
    </v-main>
  </v-app>
</template>

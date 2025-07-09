<script setup lang="ts">
defineProps<{
  error: string
}>()
</script>

<template>
  <v-alert type="error" class="mb-4">
    {{ error }}
  </v-alert>
</template>

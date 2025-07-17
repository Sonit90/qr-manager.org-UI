<script setup lang="ts">
defineProps<{ value?: boolean | null | undefined }>()
</script>

<template>
  <v-icon
    v-if="value !== null && value !== undefined"
    :icon="value ? 'mdi-check' : 'mdi-close'"
    :color="value ? 'success' : 'error'"
    size="small"
  />
</template>

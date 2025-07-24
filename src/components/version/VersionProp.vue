<script setup lang="ts">
defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <v-col cols="6" class="text-medium-emphasis py-0">{{ label }}:</v-col>
  <v-col cols="6" class="text-right py-0">{{ value }}</v-col>
</template>

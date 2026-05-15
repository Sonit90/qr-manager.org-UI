<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  keyLabel: string
  items: Array<{ name: string; count: number }>
}>()

const headers = computed(() => [
  { title: props.keyLabel, key: 'name' },
  { title: 'Count', key: 'count', align: 'end' as const },
])

const rows = computed(() => props.items.map((item, idx) => ({ id: idx, ...item })))
</script>

<template>
  <div v-if="items.length">
    <div class="text-subtitle-2 mb-2">{{ title }}</div>
    <v-data-table
      :headers="headers"
      :items="rows"
      item-value="id"
      density="compact"
      hide-default-footer
      mobile-breakpoint="sm"
      disable-sort
    />
  </div>
</template>

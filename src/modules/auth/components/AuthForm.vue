<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()

import { computed, useSlots } from 'vue'

const slots = useSlots()

const hasAppendSlot = computed(() => !!slots.append)
</script>

<template>
  <div>
    <div class="text-center py-10 pb-5">
      <h1 class="mb-2">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm">{{ subtitle }}</p>
    </div>
    <div class="pa-4">
      <slot />
      <div v-if="hasAppendSlot" class="my-4 text-center">
        <span>or</span>
      </div>
      <div v-if="hasAppendSlot" class="text-center">
        <slot name="append" />
      </div>
    </div>
  </div>
</template>

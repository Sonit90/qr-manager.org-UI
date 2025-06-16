<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div>
    <div class="text-center py-10 pb-5">
      <h1 class="mb-2">{{ title }}</h1>
      <p v-if="subtitle" class="text-sm">{{ subtitle }}</p>
    </div>
    <div class="pa-10">
      <slot />
      <div v-if="$slots.append" class="my-4 text-center">
        <span>or</span>
      </div>
      <div v-if="$slots.append" class="text-center">
        <slot name="append" />
      </div>
    </div>
  </div>
</template>

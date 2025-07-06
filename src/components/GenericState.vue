<script setup lang="ts">
import { computed } from 'vue'
import type { GenericStateProps } from '@/components/GenericStateProps.ts'

const props = defineProps<GenericStateProps>()

const iconProps = computed(() => {
  switch (props.state) {
    case 'error':
      return { icon: 'mdi-alert-circle', color: 'error' }
    case 'success':
      return { icon: 'mdi-check-circle', color: 'success' }
    case 'warning':
      return { icon: 'mdi-link-off', color: 'warning' }
    case 'info':
      return { icon: 'mdi-information', color: 'info' }
    default:
      return { icon: 'mdi-loading', color: 'primary' }
  }
})
</script>
<template>
  <div class="text-center">
    <v-icon :color="iconProps.color" size="64" class="mb-4">{{ iconProps.icon }}</v-icon>
    <v-card-title class="justify-center" :class="`text-${state}`">{{ title }}</v-card-title>
    <v-card-text class="text-center">
      {{ subtitle }}
    </v-card-text>
    <v-btn
      v-if="buttonProps"
      color="primary"
      block
      size="large"
      :prepend-icon="buttonProps.icon ?? ''"
      :to="{ path: buttonProps.path }"
    >
      {{ buttonProps.label }}
    </v-btn>
  </div>
</template>

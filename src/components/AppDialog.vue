<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

withDefaults(
  defineProps<{
    open: boolean
    title: string
    eyebrow?: string
    maxWidth?: number
    responsive?: boolean
    cardTestid?: string
  }>(),
  {
    maxWidth: 480,
    responsive: true,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()
</script>

<template>
  <v-dialog
    :model-value="open"
    :max-width="responsive && smAndDown ? undefined : maxWidth"
    :fullscreen="responsive && smAndDown"
    class="app-dialog"
    @update:model-value="emit('update:open', $event)"
  >
    <v-card :data-testid="cardTestid">
      <div class="app-dialog-title">
        <div>
          <span v-if="eyebrow" class="app-eyebrow">{{ eyebrow }}</span>
          <h3>{{ title }}</h3>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="emit('update:open', false)" />
      </div>
      <div class="app-dialog-body">
        <slot />
      </div>
      <div class="app-dialog-actions">
        <slot name="actions" />
      </div>
    </v-card>
  </v-dialog>
</template>

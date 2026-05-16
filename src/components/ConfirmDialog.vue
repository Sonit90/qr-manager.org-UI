<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    message?: string
    confirmText?: string
    cancelText?: string
    confirmColor?: string
    danger?: boolean
    loading?: boolean
  }>(),
  {
    title: 'Confirm action',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: 'primary',
    danger: false,
    loading: false,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
  cancel: []
}>()

function onCancel() {
  emit('update:open', false)
  emit('cancel')
}

function onConfirm() {
  emit('confirm')
}
</script>

<template>
  <v-dialog
    :model-value="props.open"
    :max-width="smAndDown ? undefined : 440"
    :fullscreen="smAndDown"
    class="app-dialog"
    @update:model-value="emit('update:open', $event)"
  >
    <v-card>
      <div class="app-dialog-title">
        <h3>{{ title }}</h3>
        <v-btn icon="mdi-close" variant="text" size="small" @click="onCancel" />
      </div>
      <div class="app-dialog-body">
        <p class="confirm-message">{{ message }}</p>
      </div>
      <div class="app-dialog-actions">
        <button
          type="button"
          class="app-btn app-btn-ghost"
          data-testid="confirm-cancel"
          :disabled="loading"
          @click="onCancel"
        >
          {{ cancelText }}
        </button>
        <button
          type="button"
          class="app-btn"
          :class="danger ? 'app-btn-danger' : 'app-btn-primary'"
          data-testid="confirm-accept"
          :disabled="loading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.confirm-message {
  color: var(--ink-2);
  margin: 0;
  font-size: 14.5px;
  line-height: 1.55;
}
</style>

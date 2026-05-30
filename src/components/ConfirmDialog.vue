<script setup lang="ts">
import AppDialog from '@/components/AppDialog.vue'

withDefaults(
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
  <AppDialog
    :open="open"
    :title="title"
    :max-width="440"
    @update:open="(v) => !v && onCancel()"
  >
    <p class="confirm-message">{{ message }}</p>
    <template #actions>
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
    </template>
  </AppDialog>
</template>

<style scoped>
.confirm-message {
  color: var(--ink-2);
  margin: 0;
  font-size: 14.5px;
  line-height: 1.55;
}
</style>

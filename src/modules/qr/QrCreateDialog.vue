<script setup lang="ts">
import { ref, watch } from 'vue'
import AppDialog from '@/components/AppDialog.vue'

const props = defineProps<{
  open: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  submit: [payload: { target_url: string; name: string | null }]
}>()

const targetUrl = ref('')
const name = ref('')
const formValid = ref(false)

watch(
  () => props.open,
  (v) => {
    if (v) {
      targetUrl.value = ''
      name.value = ''
    }
  },
)

function rules(v: string) {
  if (!v) return 'Required'
  return URL.canParse(v) ? true : 'Must be a valid URL'
}

function close() {
  emit('update:open', false)
}

function submit() {
  if (!formValid.value) return
  const trimmed = name.value.trim()
  emit('submit', { target_url: targetUrl.value, name: trimmed || null })
}
</script>

<template>
  <AppDialog
    :open="open"
    eyebrow="New"
    title="Create QR code"
    @update:open="emit('update:open', $event)"
  >
    <p class="dialog-sub">Give your QR a memorable name and point it anywhere.</p>
    <v-form v-model="formValid" class="form-fields" @submit.prevent="submit">
      <v-text-field
        v-model="name"
        label="Name (optional)"
        variant="outlined"
        color="primary"
        prepend-inner-icon="mdi-tag-outline"
        autofocus
        hide-details="auto"
      />
      <v-text-field
        v-model="targetUrl"
        label="Target URL"
        placeholder="https://example.com"
        variant="outlined"
        color="primary"
        prepend-inner-icon="mdi-link-variant"
        :rules="[rules]"
        required
        hide-details="auto"
      />
    </v-form>
    <template #actions>
      <button type="button" class="app-btn app-btn-ghost" :disabled="loading" @click="close">
        Cancel
      </button>
      <button
        type="button"
        class="app-btn app-btn-primary"
        :disabled="!formValid || loading"
        @click="submit"
      >
        <v-progress-circular v-if="loading" size="14" width="2" indeterminate />
        Create
      </button>
    </template>
  </AppDialog>
</template>

<style scoped>
.dialog-sub {
  margin: 0 0 18px;
  color: var(--muted);
  font-size: 14px;
}

.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>

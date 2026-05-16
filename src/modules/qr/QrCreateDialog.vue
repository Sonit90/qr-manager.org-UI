<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDisplay } from 'vuetify'

const { smAndDown } = useDisplay()

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
  try {
    new URL(v)
    return true
  } catch {
    return 'Must be a valid URL'
  }
}

function close() {
  emit('update:open', false)
}

function submit() {
  if (!formValid.value) return
  const trimmed = name.value.trim()
  emit('submit', { target_url: targetUrl.value, name: trimmed ? trimmed : null })
}
</script>

<template>
  <v-dialog
    :model-value="open"
    :max-width="smAndDown ? undefined : 480"
    :fullscreen="smAndDown"
    class="app-dialog"
    @update:model-value="emit('update:open', $event)"
  >
    <v-card>
      <div class="app-dialog-title">
        <div>
          <span class="app-eyebrow">New</span>
          <h3>Create QR code</h3>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </div>
      <div class="app-dialog-body">
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
      </div>
      <div class="app-dialog-actions">
        <button
          type="button"
          class="app-btn app-btn-ghost"
          :disabled="loading"
          @click="close"
        >
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
      </div>
    </v-card>
  </v-dialog>
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

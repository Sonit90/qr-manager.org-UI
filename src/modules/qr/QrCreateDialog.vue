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
    :max-width="smAndDown ? undefined : 500"
    :fullscreen="smAndDown"
    @update:model-value="emit('update:open', $event)"
  >
    <v-card>
      <v-card-title>New QR</v-card-title>
      <v-card-text>
        <v-form v-model="formValid" @submit.prevent="submit">
          <v-text-field v-model="name" label="Name (optional)" autofocus />
          <v-text-field
            v-model="targetUrl"
            label="Target URL"
            placeholder="https://example.com"
            :rules="[rules]"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" :disabled="loading" @click="close">Cancel</v-btn>
        <v-btn color="primary" :loading="loading" :disabled="!formValid" @click="submit">
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDisplay } from 'vuetify'
import type { VForm } from 'vuetify/components'
import { notify } from '@kyvg/vue3-notification'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import {
  isRequired,
  hasMinLength,
  hasNumber,
  matchesPassword,
} from '@/helpers/validations/validations.ts'

const { smAndDown } = useDisplay()

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const form = ref<InstanceType<typeof VForm> | null>(null)
const isLoading = ref(false)
const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

watch(
  () => props.open,
  (v) => {
    if (v) {
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
      showCurrent.value = false
      showNew.value = false
      showConfirm.value = false
      form.value?.resetValidation()
    }
  },
)

const currentPasswordRules = [isRequired('Current password')]
const newPasswordRules = [isRequired('New password'), hasMinLength(8), hasNumber]
const confirmPasswordRules = computed(() => [
  isRequired('Please confirm your new password'),
  matchesPassword(newPassword.value),
])

function close() {
  emit('update:open', false)
}

async function submit() {
  if (!form.value) return
  const { valid } = await form.value.validate()
  if (!valid) return

  try {
    isLoading.value = true
    await ApiClientV1.changePassword({
      current_password: currentPassword.value,
      new_password: newPassword.value,
    })
    notify({ type: 'success', title: 'Password changed', text: 'Your password has been updated.' })
    close()
  } catch (e) {
    handleApiError(e, { title: 'Change Password' })
  } finally {
    isLoading.value = false
  }
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
          <span class="app-eyebrow">Security</span>
          <h3>Change password</h3>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="close" />
      </div>
      <div class="app-dialog-body">
        <v-form ref="form" class="form-fields" @submit.prevent="submit">
          <v-text-field
            v-model="currentPassword"
            :rules="currentPasswordRules"
            :type="showCurrent ? 'text' : 'password'"
            label="Current password"
            autocomplete="current-password"
            prepend-inner-icon="mdi-lock"
            variant="outlined"
            color="primary"
            hide-details="auto"
            required
          >
            <template #append-inner>
              <v-icon tabindex="-1" @click="showCurrent = !showCurrent">
                {{ showCurrent ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="newPassword"
            :rules="newPasswordRules"
            :type="showNew ? 'text' : 'password'"
            label="New password"
            autocomplete="new-password"
            prepend-inner-icon="mdi-lock-reset"
            variant="outlined"
            color="primary"
            hide-details="auto"
            required
          >
            <template #append-inner>
              <v-icon tabindex="-1" @click="showNew = !showNew">
                {{ showNew ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
          </v-text-field>
          <v-text-field
            v-model="confirmPassword"
            :rules="confirmPasswordRules"
            :type="showConfirm ? 'text' : 'password'"
            label="Confirm new password"
            autocomplete="new-password"
            prepend-inner-icon="mdi-lock-check"
            variant="outlined"
            color="primary"
            hide-details="auto"
            required
          >
            <template #append-inner>
              <v-icon tabindex="-1" @click="showConfirm = !showConfirm">
                {{ showConfirm ? 'mdi-eye' : 'mdi-eye-off' }}
              </v-icon>
            </template>
          </v-text-field>
        </v-form>
      </div>
      <div class="app-dialog-actions">
        <button type="button" class="app-btn app-btn-ghost" :disabled="isLoading" @click="close">
          Cancel
        </button>
        <button
          type="button"
          class="app-btn app-btn-primary"
          :disabled="isLoading"
          @click="submit"
        >
          <v-progress-circular v-if="isLoading" size="14" width="2" indeterminate />
          Update password
        </button>
      </div>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>

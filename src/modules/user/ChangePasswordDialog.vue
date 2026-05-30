<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { notify } from '@kyvg/vue3-notification'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import PasswordField from '@/components/PasswordField.vue'
import AppDialog from '@/components/AppDialog.vue'
import {
  isRequired,
  hasMinLength,
  hasNumber,
  matchesPassword,
} from '@/helpers/validations/validations.ts'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const form = ref<InstanceType<typeof VForm> | null>(null)
const isLoading = ref(false)

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
  <AppDialog
    :open="open"
    eyebrow="Security"
    title="Change password"
    @update:open="emit('update:open', $event)"
  >
    <v-form ref="form" class="form-fields" @submit.prevent="submit">
      <PasswordField
        v-model="currentPassword"
        :rules="currentPasswordRules"
        label="Current password"
        autocomplete="current-password"
        hide-details="auto"
      />
      <PasswordField
        v-model="newPassword"
        :rules="newPasswordRules"
        label="New password"
        autocomplete="new-password"
        icon="mdi-lock-reset"
        hide-details="auto"
      />
      <PasswordField
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
        label="Confirm new password"
        autocomplete="new-password"
        icon="mdi-lock-check"
        hide-details="auto"
      />
    </v-form>
    <template #actions>
      <button type="button" class="app-btn app-btn-ghost" :disabled="isLoading" @click="close">
        Cancel
      </button>
      <button type="button" class="app-btn app-btn-primary" :disabled="isLoading" @click="submit">
        <v-progress-circular v-if="isLoading" size="14" width="2" indeterminate />
        Update password
      </button>
    </template>
  </AppDialog>
</template>

<style scoped>
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
</style>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import { isRequired, isValidEmail } from '@/helpers/validations/validations.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'

const resetForm = ref<Ref | null>(null)
const isLoading = ref(false)
const emailSent = ref(false)

const form = reactive({
  email: '',
})

const emailRules = [isRequired('E-mail'), isValidEmail]

const handleResetPassword = async () => {
  if (!resetForm.value) return
  const { valid } = await resetForm.value.validate()
  if (!valid) {
    return
  }
  try {
    isLoading.value = true
    await ApiClientV1.forgotPassword({ email: form.email })
    emailSent.value = true
  } catch (e) {
    handleApiError(e, { title: 'Password reset' })
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <AuthForm
    title="Reset Password"
    :subtitle="emailSent ? '' : 'Enter your email to receive reset instructions'"
  >
    <v-form v-if="!emailSent" ref="resetForm" @submit.prevent="handleResetPassword">
      <div class="mb-2">
        <v-text-field
          v-model="form.email"
          :rules="emailRules"
          label="Email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          color="primary"
          required
        />
      </div>

      <button
        type="submit"
        class="app-btn app-btn-primary app-btn-lg app-btn-block"
        :disabled="isLoading"
      >
        <v-progress-circular v-if="isLoading" size="16" width="2" indeterminate />
        Send Reset Link
      </button>
    </v-form>
    <div v-else class="text-center py-4">
      <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
      <h3 class="mb-3 text-gray-800 font-normal">Check Your Email</h3>
      <p class="mb-4 text-gray-600 leading-relaxed">
        We've sent password reset instructions to <strong>{{ form.email }}</strong>
      </p>
    </div>
    <template #append>
      <div class="text-center">
        <span>Remember your password? </span>
        <router-link to="/login" class="link-styled"> Sign in </router-link>
      </div>

      <div class="text-center mt-3">
        <span class="mr-2">Don't have an account? </span>
        <router-link to="/register" class="link-styled"> Sign up </router-link>
      </div>
    </template>
  </AuthForm>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import { isRequired, isValidEmail } from '@/helpers/validations/validations.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'

const resetForm = ref<Ref | null>(null)
const loading = ref(false)
const emailSent = ref(false)

const form = reactive({
  email: '',
})

const emailRules = [isRequired('E-mail'), isValidEmail]

const handleResetPassword = async () => {
  if (!resetForm.value) return
  const { valid } = await resetForm.value.validate()
  if (valid) {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      loading.value = false
      emailSent.value = true
      // Handle password reset here
    }, 2000)
  }
}
</script>

<template>
  <AuthForm title="Reset Password" subtitle="Enter your email to receive reset instructions">
    <v-form @submit.prevent="handleResetPassword" ref="resetForm" v-if="!emailSent">
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

      <v-btn type="submit" class="btn-primary" color="primary" :loading="loading" block>
        Send Reset Link
      </v-btn>
    </v-form>
    <!-- Success Message -->
    <div v-else class="text-center py-4">
      <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
      <h3 class="mb-3 text-gray-800 font-normal">Check Your Email</h3>
      <p class="mb-4 text-gray-600 leading-relaxed">
        We've sent password reset instructions to <strong>{{ form.email }}</strong>
      </p>
      <v-btn @click="emailSent = false" variant="outlined" color="primary" class="mb-3" block>
        Send Another Email
      </v-btn>
    </div>
    <template #append>
      <div class="text-center">
        <span>Remember your password? </span>
        <router-link to="/login" class="link-styled"> Sign in </router-link>
      </div>

      <div class="text-center mt-3">
        <span>Don't have an account? </span>
        <router-link to="/register" class="link-styled"> Sign up </router-link>
      </div>
    </template>
  </AuthForm>
</template>

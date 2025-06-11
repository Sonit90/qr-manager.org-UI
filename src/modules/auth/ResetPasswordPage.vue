<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import { isRequired, isValidEmail } from '@/helpers/validations/validations.ts'

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
  <div>
    <div class="text-center py-4">
      <h1 class="text-3xl font-light text-gray-800 mb-2">Reset Password</h1>
      <p class="text-gray-600 text-sm">Enter your email to receive reset instructions</p>
    </div>

    <div class="pa-4">
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

      <div
        class="text-center my-4 relative text-gray-500 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-300"
      >
        <span>or</span>
      </div>

      <div class="text-center">
        <span>Remember your password? </span>
        <router-link to="/login" class="link-styled"> Sign in </router-link>
      </div>

      <div class="text-center mt-3">
        <span>Don't have an account? </span>
        <router-link to="/register" class="link-styled"> Sign up </router-link>
      </div>
    </div>
  </div>
</template>

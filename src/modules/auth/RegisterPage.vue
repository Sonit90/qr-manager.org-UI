<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'

const router = useRouter()
const registerForm = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

const nameRules = [
  (v) => !!v || 'Name is required',
  (v) => (v && v.length >= 2) || 'Name must be at least 2 characters',
]

const emailRules = [
  (v) => !!v || 'E-mail is required',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => (v && v.length >= 8) || 'Password must be at least 8 characters',
  (v) => /(?=.*[a-z])/.test(v) || 'Password must contain at least one lowercase letter',
  (v) => /(?=.*[A-Z])/.test(v) || 'Password must contain at least one uppercase letter',
  (v) => /(?=.*\d)/.test(v) || 'Password must contain at least one number',
]

const confirmPasswordRules = [
  (v) => !!v || 'Please confirm your password',
  (v) => v === form.password || 'Passwords do not match',
]

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

const handleRegister = async () => {
  const { valid } = await registerForm.value.validate()

  if (!valid) {
    return
  }
  await userStore.register({
    email: form.email,
    password: form.password,
    confirm_password: form.confirmPassword,
  })
}
</script>
<template>
  <div>
    <div class="text-center pt-10 pb-5">
      <h1 class="text-3xl font-light text-gray-800 mb-2">Create Account</h1>
    </div>

    <div class="px-10 pb-10">
      <v-form class="gap-4" @submit.prevent="handleRegister" ref="registerForm">
        <v-text-field
          v-model="form.firstName"
          :rules="nameRules"
          label="First Name"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          color="primary"
          required
        />

        <v-text-field
          v-model="form.lastName"
          :rules="nameRules"
          label="Last Name"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          color="primary"
          required
        />

        <v-text-field
          v-model="form.email"
          :rules="emailRules"
          label="Email"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          color="primary"
          required
        />

        <v-text-field
          v-model="form.password"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          prepend-inner-icon="mdi-lock"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showPassword = !showPassword"
          variant="outlined"
          color="primary"
          required
        />

        <v-text-field
          v-model="form.confirmPassword"
          :rules="confirmPasswordRules"
          :type="showConfirmPassword ? 'text' : 'password'"
          label="Confirm Password"
          prepend-inner-icon="mdi-lock-check"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          variant="outlined"
          color="primary"
          required
        />

        <v-checkbox
          v-model="form.agreeToTerms"
          :rules="[(v) => !!v || 'You must agree to the terms and conditions']"
          color="primary"
          required
        >
          <template v-slot:label>
            <span>
              I agree to the
              <a href="#" class="link-styled"> Terms and Conditions </a>
            </span>
          </template>
        </v-checkbox>

        <v-btn type="submit" class="btn-primary" color="primary" :loading="isLoading" block>
          Create Account
        </v-btn>
      </v-form>

      <div
        class="text-center my-8 relative text-gray-500 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-300"
      >
        <span>or</span>
      </div>

      <div class="text-center">
        <span>Already have an account? </span>
        <router-link to="/login" class="link-styled"> Sign in </router-link>
      </div>
    </div>
  </div>
</template>

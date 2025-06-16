<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import {
  hasLowercase,
  hasMinLength,
  hasNumber,
  hasUppercase,
  isRequired,
  isValidEmail,
  matchesPassword,
} from '@/helpers/validations/validations.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'

const registerForm = ref<Ref | null>(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
})

const nameRules = [isRequired('Name'), hasMinLength(2)]

const emailRules = [isRequired('E-mail'), isValidEmail]

const passwordRules = [
  isRequired('Password'),
  hasMinLength(8),
  hasLowercase,
  hasUppercase,
  hasNumber,
]

const confirmPasswordRules = [
  isRequired('Please confirm your password'),
  matchesPassword(form.password),
]

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

const handleRegister = async () => {
  if (!registerForm.value) return
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
  <AuthForm title="Create Account">
    <v-form class="ga-4" @submit.prevent="handleRegister" ref="registerForm">
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

    <template #append>
      <span>Already have an account? </span>
      <router-link to="/login" class="link-styled"> Sign in </router-link>
    </template>
  </AuthForm>
</template>

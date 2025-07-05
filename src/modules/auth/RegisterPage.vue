<script setup lang="ts">
import { ref, reactive, type Ref, computed } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import {
  hasMinLength,
  hasNumber,
  isRequired,
  isValidEmail,
  matchesPassword,
} from '@/helpers/validations/validations.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

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

const passwordRules = [isRequired('Password'), hasMinLength(8), hasNumber]

const confirmPasswordRules = computed(() => [
  isRequired('Please confirm your password'),
  matchesPassword(form.password),
])

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

const requestSent = ref(false)

const handleRegister = async () => {
  if (!registerForm.value) return
  const { valid } = await registerForm.value.validate()

  if (!valid) {
    return
  }
  try {
    await userStore.register({
      full_name: [form.firstName, form.lastName].filter(Boolean).join(' '),
      email: form.email,
      password: form.password,
    })
    requestSent.value = true
  } catch (e) {
    handleApiError(e, { title: 'Registration' })
    requestSent.value = false
  }
}
</script>
<template>
  <AuthForm title="Create Account">
    <v-form v-if="!requestSent" ref="registerForm" class="ga-4" @submit.prevent="handleRegister">
      <v-text-field
        v-model.trim="form.firstName"
        :rules="nameRules"
        label="First Name"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        color="primary"
        required
      />

      <v-text-field
        v-model.trim="form.lastName"
        :rules="nameRules"
        label="Last Name"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        color="primary"
        required
      />

      <v-text-field
        v-model.trim="form.email"
        :rules="emailRules"
        label="Email"
        prepend-inner-icon="mdi-email"
        variant="outlined"
        color="primary"
        required
      />

      <v-text-field
        v-model.trim="form.password"
        :rules="passwordRules"
        :type="showPassword ? 'text' : 'password'"
        label="Password"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        variant="outlined"
        color="primary"
        required
        @click:append-inner="showPassword = !showPassword"
      />

      <v-text-field
        v-model.trim="form.confirmPassword"
        :rules="confirmPasswordRules"
        :type="showConfirmPassword ? 'text' : 'password'"
        label="Confirm Password"
        prepend-inner-icon="mdi-lock-check"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
        variant="outlined"
        color="primary"
        required
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
      />

      <v-checkbox
        v-model="form.agreeToTerms"
        :rules="[(v) => !!v || 'You must agree to the terms and conditions']"
        color="primary"
        required
      >
        <template #label>
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
    <div v-else class="text-center">
      <v-icon color="success" size="64" class="mb-4"> mdi-check-circle </v-icon>
      <v-card-title class="justify-center text-success"> Registrered Successfully! </v-card-title>
      <v-card-text class="text-center">
        Please check your e-mail for activation link. You can now sign in and start using our
        platform.
      </v-card-text>
    </div>

    <template #append>
      <span>Already have an account? </span>
      <router-link to="/login" class="link-styled"> Sign in </router-link>
    </template>
  </AuthForm>
</template>

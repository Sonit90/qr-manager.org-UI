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
import { useRouter } from 'vue-router'

const router = useRouter()
const registerForm = ref<Ref | null>(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  display_name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const emailRules = [isRequired('E-mail'), isValidEmail]

const passwordRules = [isRequired('Password'), hasMinLength(8), hasNumber]

const confirmPasswordRules = computed(() => [
  isRequired('Please confirm your password'),
  matchesPassword(form.password),
])

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

const handleRegister = async () => {
  if (!registerForm.value) return
  const { valid } = await registerForm.value.validate()

  if (!valid) {
    return
  }
  try {
    await userStore.register({
      display_name: form.display_name || null,
      email: form.email,
      password: form.password,
    })
    await router.push('/user')
  } catch (e) {
    handleApiError(e, { title: 'Registration' })
  }
}
</script>
<template>
  <AuthForm title="Create Account">
    <v-form ref="registerForm" class="ga-4" @submit.prevent="handleRegister">
      <v-text-field
        v-model.trim="form.display_name"
        label="Display Name (optional)"
        prepend-inner-icon="mdi-account"
        variant="outlined"
        color="primary"
      />

      <v-text-field
        v-model.trim="form.email"
        :rules="emailRules"
        label="Email"
        name="email"
        autocomplete="email"
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
        name="password"
        autocomplete="new-password"
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
        name="confirm-password"
        autocomplete="new-password"
        prepend-inner-icon="mdi-lock-check"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
        variant="outlined"
        color="primary"
        required
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
      />

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

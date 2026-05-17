<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import { hasMinLength, isRequired, isValidEmail } from '@/helpers/validations/validations.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

const router = useRouter()
const loginForm = ref<Ref | null>(null)
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
})

const emailRules = [isRequired('E-mail'), isValidEmail]

const passwordRules = [isRequired('Password'), hasMinLength(8)]
const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

const handleLogin = async () => {
  if (!loginForm.value) return
  const { valid } = await loginForm.value.validate()
  if (!valid) {
    return
  }
  try {
    await userStore.login({ email: form.email, password: form.password })
    notify({
      title: 'Authorization',
      text: 'You have been logged in!',
      type: 'success',
    })
    await router.push('/user')
  } catch (e) {
    handleApiError(e, { title: 'Authorization' })
  }
}
</script>
<template>
  <AuthForm title="Welcome Back" subtitle="Sign in to your account">
    <v-form ref="loginForm" class="ga-4" @submit.prevent="handleLogin">
      <v-text-field
        v-model.trim="form.email"
        :rules="emailRules"
        label="Email"
        autocomplete="email"
        name="email"
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
        autocomplete="current-password"
        name="password"
        prepend-inner-icon="mdi-lock"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        variant="outlined"
        color="primary"
        required
        @click:append-inner="showPassword = !showPassword"
      />
      <div class="mb-4 d-flex justify-end">
        <router-link to="/forgot-password" class="link-styled">Forgot password?</router-link>
      </div>
      <button
        type="submit"
        class="app-btn app-btn-primary app-btn-lg app-btn-block"
        :disabled="isLoading"
      >
        <v-progress-circular v-if="isLoading" size="16" width="2" indeterminate />
        Sign In
      </button>
    </v-form>
    <template #append>
      <span class="mr-2">Don't have an account?</span>
      <router-link to="/register" class="link-styled">Sign up</router-link>
    </template>
  </AuthForm>
</template>

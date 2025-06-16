<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import { hasMinLength, isRequired, isValidEmail } from '@/helpers/validations/validations.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'

const loginForm = ref<Ref | null>(null)
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const emailRules = [isRequired('E-mail'), isValidEmail]

const passwordRules = [isRequired('Password'), hasMinLength(6)]
const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

const handleLogin = async () => {
  if (!loginForm.value) return
  const { valid } = await loginForm.value.validate()
  if (!valid) {
    return
  }

  await userStore.login({ username: form.email, password: form.password })
}
</script>
<template>
  <AuthForm title="Welcome Back" subtitle="Sign in to your account">
    <v-form class="ga-4" @submit.prevent="handleLogin" ref="loginForm">
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
      <v-row align="center" justify="space-between">
        <v-col cols="auto">
          <v-checkbox v-model="form.remember" label="Remember me" color="primary" hide-details />
        </v-col>
        <v-col cols="auto">
          <router-link to="/reset-password" class="link-styled"> Forgot password? </router-link>
        </v-col>
      </v-row>
      <v-btn type="submit" class="btn-primary" color="primary" :loading="isLoading" block>
        Sign In
      </v-btn>
    </v-form>
    <template #append>
      <span>Don't have an account? </span>
      <router-link to="/register" class="link-styled"> Sign up </router-link>
    </template>
  </AuthForm>
</template>

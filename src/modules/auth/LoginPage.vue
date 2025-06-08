<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginForm = ref(null)
const showPassword = ref(false)
const loading = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const emailRules = [
  (v) => !!v || 'E-mail is required',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => (v && v.length >= 6) || 'Password must be at least 6 characters',
]

const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  if (valid) {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      loading.value = false
      console.log('Login attempt:', form)
      // Handle successful login here
    }, 2000)
  }
}
</script>
<template>
  <div>
    <div class="text-center py-10 pb-5">
      <h1 class="text-3xl font-light text-gray-800 mb-2">Welcome Back</h1>
      <p class="text-gray-600 text-sm">Sign in to your account</p>
    </div>

    <div class="px-10 pb-10">
      <v-form class="gap-4" @submit.prevent="handleLogin" ref="loginForm">
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

        <v-btn type="submit" class="btn-primary" color="primary" :loading="loading" block>
          Sign In
        </v-btn>
      </v-form>

      <div
        class="text-center my-8 relative text-gray-500 before:content-[''] before:absolute before:top-1/2 before:left-0 before:right-0 before:h-px before:bg-gray-300"
      >
        <span class="bg-white/95 px-5">or</span>
      </div>

      <div class="text-center">
        <span>Don't have an account? </span>
        <router-link to="/register" class="link-styled"> Sign up </router-link>
      </div>
    </div>
  </div>
</template>

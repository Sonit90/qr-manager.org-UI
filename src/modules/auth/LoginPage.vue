<script setup>
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
    <div class="auth-header">
      <h1 class="auth-title">Welcome Back</h1>
      <p class="auth-subtitle">Sign in to your account</p>
    </div>

    <div class="auth-form">
      <v-form @submit.prevent="handleLogin" ref="loginForm">
        <div class="form-field">
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

        <div class="form-field">
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
        </div>

        <div class="form-field">
          <v-row align="center" justify="space-between">
            <v-col cols="auto">
              <v-checkbox
                v-model="form.remember"
                label="Remember me"
                color="primary"
                hide-details
              />
            </v-col>
            <v-col cols="auto">
              <router-link to="/reset-password" class="link-button"> Forgot password? </router-link>
            </v-col>
          </v-row>
        </div>

        <v-btn type="submit" class="auth-button" color="primary" :loading="loading" block>
          Sign In
        </v-btn>
      </v-form>

      <div class="divider-text">
        <span>or</span>
      </div>

      <div class="text-center">
        <span>Don't have an account? </span>
        <router-link to="/register" class="link-button"> Sign up </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-header {
  text-align: center;
  padding: 40px 0 20px;
}

.auth-title {
  font-size: 2rem;
  font-weight: 300;
  color: #333;
  margin-bottom: 8px;
}

.auth-subtitle {
  color: #666;
  font-size: 0.9rem;
}

.auth-form {
  padding: 0 40px 40px;
}

.form-field {
  margin-bottom: 20px;
}

.auth-button {
  height: 50px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  text-transform: none;
  box-shadow: 0 4px 15px rgba(103, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.auth-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(103, 126, 234, 0.4);
}

.link-button {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.link-button:hover {
  color: #764ba2;
  text-decoration: underline;
}

.divider-text {
  text-align: center;
  margin: 30px 0;
  position: relative;
  color: #999;
}

.divider-text::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider-text span {
  background: rgba(255, 255, 255, 0.95);
  padding: 0 20px;
}
</style>

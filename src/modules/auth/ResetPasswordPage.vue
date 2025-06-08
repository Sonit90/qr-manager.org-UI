<template>
  <div>
    <div class="auth-header">
      <h1 class="auth-title">Reset Password</h1>
      <p class="auth-subtitle">Enter your email to receive reset instructions</p>
    </div>

    <div class="auth-form">
      <v-form @submit.prevent="handleResetPassword" ref="resetForm" v-if="!emailSent">
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

        <v-btn type="submit" class="auth-button" color="primary" :loading="loading" block>
          Send Reset Link
        </v-btn>
      </v-form>

      <!-- Success Message -->
      <div v-else class="success-message">
        <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
        <h3 class="mb-3">Check Your Email</h3>
        <p class="mb-4">
          We've sent password reset instructions to <strong>{{ form.email }}</strong>
        </p>
        <v-btn @click="emailSent = false" variant="outlined" color="primary" class="mb-3" block>
          Send Another Email
        </v-btn>
      </div>

      <div class="divider-text">
        <span>or</span>
      </div>

      <div class="text-center">
        <span>Remember your password? </span>
        <router-link to="/login" class="link-button"> Sign in </router-link>
      </div>

      <div class="text-center mt-3">
        <span>Don't have an account? </span>
        <router-link to="/register" class="link-button"> Sign up </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const resetForm = ref(null)
const loading = ref(false)
const emailSent = ref(false)

const form = reactive({
  email: '',
})

const emailRules = [
  (v) => !!v || 'E-mail is required',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
]

const handleResetPassword = async () => {
  const { valid } = await resetForm.value.validate()
  if (valid) {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      loading.value = false
      emailSent.value = true
      console.log('Password reset request:', form)
      // Handle password reset here
    }, 2000)
  }
}
</script>

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

.success-message {
  text-align: center;
  padding: 20px 0;
}

.success-message h3 {
  color: #333;
  font-weight: 400;
}

.success-message p {
  color: #666;
  line-height: 1.5;
}
</style>

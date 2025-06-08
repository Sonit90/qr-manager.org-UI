<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

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

const handleRegister = async () => {
  const { valid } = await registerForm.value.validate()
  if (valid) {
    loading.value = true
    // Simulate API call
    setTimeout(() => {
      loading.value = false
      console.log('Registration attempt:', form)
      // Handle successful registration here
      router.push('/login')
    }, 2000)
  }
}
</script>
<template>
  <div>
    <div class="auth-header">
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-subtitle">Join us today</p>
    </div>

    <div class="auth-form">
      <v-form @submit.prevent="handleRegister" ref="registerForm">
        <div class="form-field">
          <v-text-field
            v-model="form.firstName"
            :rules="nameRules"
            label="First Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            required
          />
        </div>

        <div class="form-field">
          <v-text-field
            v-model="form.lastName"
            :rules="nameRules"
            label="Last Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            color="primary"
            required
          />
        </div>

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
        </div>

        <div class="form-field">
          <v-checkbox
            v-model="form.agreeToTerms"
            :rules="[(v) => !!v || 'You must agree to the terms and conditions']"
            color="primary"
            required
          >
            <template v-slot:label>
              <span
                >I agree to the
                <a href="#" class="link-button">Terms and Conditions</a>
              </span>
            </template>
          </v-checkbox>
        </div>

        <v-btn type="submit" class="auth-button" color="primary" :loading="loading" block>
          Create Account
        </v-btn>
      </v-form>

      <div class="divider-text">
        <span>or</span>
      </div>

      <div class="text-center">
        <span>Already have an account? </span>
        <router-link to="/login" class="link-button"> Sign in </router-link>
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

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
const requestSent = ref(false)
const consentAccepted = ref(false)

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

      <label class="consent-row">
        <span class="consent-checkbox-wrap" :class="{ 'is-checked': consentAccepted }">
          <input
            v-model="consentAccepted"
            type="checkbox"
            class="consent-checkbox-input"
            aria-required="true"
          />
          <v-icon v-if="consentAccepted" size="12" color="white">mdi-check</v-icon>
        </span>
        <span class="consent-text">
          I agree to the
          <router-link to="/terms" class="consent-link" target="_blank"
            >Terms of Service</router-link
          >
          and
          <router-link to="/privacy" class="consent-link" target="_blank"
            >Privacy Policy</router-link
          >
        </span>
      </label>

      <button
        type="submit"
        class="app-btn app-btn-primary app-btn-lg app-btn-block"
        :disabled="isLoading || !consentAccepted"
      >
        <v-progress-circular v-if="isLoading" size="16" width="2" indeterminate />
        Create Account
      </button>
    </v-form>
    <div v-else class="text-center">
      <v-icon color="success" size="64" class="mb-4"> mdi-check-circle </v-icon>
      <v-card-title class="justify-center text-success"> Registered Successfully! </v-card-title>
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

<style scoped>
.consent-row {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
  margin-top: 4px;
  margin-bottom: 8px;
}

.consent-checkbox-wrap {
  position: relative;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  border: 2px solid var(--line-strong);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.consent-checkbox-wrap.is-checked {
  border-color: var(--accent);
  background: var(--accent);
}

.consent-checkbox-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  margin: 0;
}

.consent-text {
  font-size: 13.5px;
  color: var(--ink-2);
  line-height: 1.5;
}

.consent-link {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
</style>

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
import TermsOfServiceContent from '@/modules/legal/TermsOfServiceContent.vue'
import PrivacyPolicyContent from '@/modules/legal/PrivacyPolicyContent.vue'
import { useStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { PENDING_EMAIL_KEY } from '@/modules/auth/activation/useActivation.ts'

const router = useRouter()
const storedEmail = useStorage<string>(PENDING_EMAIL_KEY, '')

const registerForm = ref<Ref | null>(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
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

const legalDialog = reactive({ open: false, type: 'terms' as 'terms' | 'privacy' })
const legalDialogTitle = computed(() =>
  legalDialog.type === 'terms' ? 'Terms of Service' : 'Privacy Policy',
)

function openLegal(type: 'terms' | 'privacy') {
  legalDialog.type = type
  legalDialog.open = true
}

const isFormFilled = computed(
  () =>
    !!form.email &&
    form.password.length >= 8 &&
    form.confirmPassword === form.password &&
    consentAccepted.value,
)

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
    storedEmail.value = form.email
    await router.push('/activate')
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
        variant="outlined"
        color="primary"
        required
      >
        <template #append-inner>
          <v-icon tabindex="-1" @click="showPassword = !showPassword">
            {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
          </v-icon>
        </template>
      </v-text-field>

      <v-text-field
        v-model.trim="form.confirmPassword"
        :rules="confirmPasswordRules"
        :type="showConfirmPassword ? 'text' : 'password'"
        label="Confirm Password"
        name="confirm-password"
        autocomplete="new-password"
        prepend-inner-icon="mdi-lock-check"
        variant="outlined"
        color="primary"
        required
      >
        <template #append-inner>
          <v-icon tabindex="-1" @click="showConfirmPassword = !showConfirmPassword">
            {{ showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off' }}
          </v-icon>
        </template>
      </v-text-field>

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
          <button type="button" class="consent-link" @click="openLegal('terms')"
            >Terms of Service</button
          >
          and
          <button type="button" class="consent-link" @click="openLegal('privacy')"
            >Privacy Policy</button
          >
        </span>
      </label>

      <v-dialog v-model="legalDialog.open" max-width="800" scrollable>
        <v-card>
          <v-card-title class="legal-dialog-title">
            {{ legalDialogTitle }}
            <v-btn icon size="small" variant="text" @click="legalDialog.open = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text class="legal-dialog-body">
            <TermsOfServiceContent v-if="legalDialog.type === 'terms'" />
            <PrivacyPolicyContent v-else />
          </v-card-text>
        </v-card>
      </v-dialog>

      <button
        type="submit"
        class="app-btn app-btn-primary app-btn-lg app-btn-block"
        :disabled="isLoading || !isFormFilled"
      >
        <v-progress-circular v-if="isLoading" size="16" width="2" indeterminate />
        Create Account
      </button>
    </v-form>

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
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.legal-dialog-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 700;
  padding: 16px 20px;
}

.legal-dialog-body {
  padding: 24px 20px;
}
</style>

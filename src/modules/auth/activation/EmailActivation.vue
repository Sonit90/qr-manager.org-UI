<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useActivation } from '@/modules/auth/activation/useActivation.ts'
import { ActivationStatus } from '@/modules/auth/activation/types.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'

const { email, status, errorMessage, isLoading, isResending, resendSuccess, verifyCode, resendCode } =
  useActivation()

const digits = ref<string[]>(['', '', '', '', '', ''])
const inputRefs = ref<HTMLInputElement[]>([])

const code = computed(() => digits.value.join(''))
const isComplete = computed(() => code.value.length === 6 && digits.value.every((d) => /\d/.test(d)))

function focusNext(index: number) {
  if (index < 5) {
    inputRefs.value[index + 1]?.focus()
  }
}

function focusPrev(index: number) {
  if (index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
}

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const val = input.value.replace(/\D/g, '')
  digits.value[index] = val.slice(-1)
  if (digits.value[index]) {
    focusNext(index)
  }
}

function onKeydown(index: number, event: KeyboardEvent) {
  if (event.key === 'Backspace' && !digits.value[index]) {
    focusPrev(index)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    focusPrev(index)
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    focusNext(index)
  }
}

function onPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text') ?? ''
  const onlyDigits = pasted.replace(/\D/g, '').slice(0, 6)
  onlyDigits.split('').forEach((d, i) => {
    digits.value[i] = d
  })
  const nextEmpty = onlyDigits.length < 6 ? onlyDigits.length : 5
  inputRefs.value[nextEmpty]?.focus()
}

function onFocus(index: number) {
  inputRefs.value[index]?.select()
}

async function handleSubmit() {
  if (!isComplete.value || isLoading.value) return
  await verifyCode(code.value)
}

onMounted(() => {
  inputRefs.value[0]?.focus()
})
</script>

<template>
  <div class="activation-container">
    <div class="activation-card-wrap">
      <AuthForm title="Verify Your Email" subtitle="Enter the 6-digit code sent to your email">
        <div v-if="email" class="email-display">
          <v-icon size="16" class="mr-1">mdi-email-outline</v-icon>
          <span>{{ email }}</span>
        </div>

        <form class="otp-form" @submit.prevent="handleSubmit">
          <div class="otp-inputs" aria-label="Verification code">
            <input
              v-for="(_, i) in digits"
              :key="i"
              :ref="(el) => { if (el) inputRefs[i] = el as HTMLInputElement }"
              v-model="digits[i]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              pattern="[0-9]"
              autocomplete="one-time-code"
              :aria-label="`Digit ${i + 1}`"
              class="otp-input"
              :class="{ 'otp-input--filled': digits[i] }"
              @input="onInput(i, $event)"
              @keydown="onKeydown(i, $event)"
              @paste="onPaste"
              @focus="onFocus(i)"
            />
          </div>

          <transition name="fade">
            <div v-if="errorMessage" class="otp-error" role="alert">
              <v-icon size="16" class="mr-1">mdi-alert-circle-outline</v-icon>
              {{ errorMessage }}
            </div>
          </transition>

          <transition name="fade">
            <div v-if="resendSuccess" class="otp-success-msg" role="status">
              <v-icon size="16" class="mr-1">mdi-check-circle-outline</v-icon>
              New code sent! Check your inbox.
            </div>
          </transition>

          <button
            type="submit"
            class="app-btn app-btn-primary app-btn-lg app-btn-block"
            :disabled="!isComplete || isLoading || status === ActivationStatus.RATE_LIMITED"
          >
            <v-progress-circular v-if="isLoading" size="16" width="2" indeterminate class="mr-2" />
            {{ isLoading ? 'Verifying...' : 'Verify Email' }}
          </button>
        </form>

        <div class="resend-row">
          <span class="resend-label">Didn't receive a code?</span>
          <button
            type="button"
            class="resend-btn"
            :disabled="isResending"
            @click="resendCode"
          >
            <v-progress-circular v-if="isResending" size="12" width="2" indeterminate class="mr-1" />
            {{ isResending ? 'Sending...' : 'Resend code' }}
          </button>
        </div>
      </AuthForm>
    </div>
  </div>
</template>

<style scoped>
.activation-container {
  background-image: linear-gradient(to bottom right, #6366f1, #8b5cf6);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.activation-card-wrap {
  width: 100%;
  max-width: 420px;
  background: var(--bg, #fff);
  border-radius: 12px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.email-display {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13.5px;
  color: var(--ink-2, #64748b);
  background: var(--bg-2, #f8fafc);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 20px;
  gap: 4px;
}

.otp-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.otp-inputs {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.otp-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  border: 2px solid var(--line, #e2e8f0);
  border-radius: 10px;
  background: var(--bg, #fff);
  color: var(--ink, #0f172a);
  outline: none;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  caret-color: transparent;
}

.otp-input:focus {
  border-color: var(--accent, #6366f1);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.otp-input--filled {
  border-color: var(--accent, #6366f1);
}

@media (max-width: 400px) {
  .otp-input {
    width: 40px;
    height: 48px;
    font-size: 18px;
  }

  .otp-inputs {
    gap: 6px;
  }
}

.otp-error {
  display: flex;
  align-items: center;
  color: rgb(var(--v-theme-error, 239, 68, 68));
  font-size: 13.5px;
  gap: 4px;
}

.otp-success-msg {
  display: flex;
  align-items: center;
  color: rgb(var(--v-theme-success, 34, 197, 94));
  font-size: 13.5px;
  gap: 4px;
}

.resend-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  font-size: 13.5px;
  color: var(--ink-2, #64748b);
}

.resend-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--accent, #6366f1);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  display: inline-flex;
  align-items: center;
}

.resend-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

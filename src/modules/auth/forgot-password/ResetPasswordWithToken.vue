<script setup lang="ts">
import { computed } from 'vue'
import GenericState from '@/components/GenericState.vue'
import { ResetPasswordStatus } from '@/modules/auth/forgot-password/types.ts'
import { usePasswordReset } from '@/modules/auth/forgot-password/usePasswordReset.ts'
import AuthForm from '@/modules/auth/components/AuthForm.vue'
import {
  hasMinLength,
  hasNumber,
  isRequired,
  matchesPassword,
} from '@/helpers/validations/validations.ts'
import type { GenericStateProps } from '@/components/GenericStateProps.ts'

const {
  resetStatus,
  errorMessage,
  isLoading,
  resetPassword,
  params,
  form,
  valid,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
} = usePasswordReset()

const componentMap: Record<
  Exclude<ResetPasswordStatus, ResetPasswordStatus.INITIAL>,
  GenericStateProps
> = {
  [ResetPasswordStatus.LOADING]: {
    state: 'loading',
    title: 'Resetting your password...',
    subtitle: 'Please wait while we process your password reset request.',
  },
  [ResetPasswordStatus.SUCCESS]: {
    state: 'success',
    title: 'Password Reset Successful!',
    subtitle:
      'Your password has been successfully reset. You can now sign in with your new password.',
  },
  [ResetPasswordStatus.ERROR]: {
    state: 'error',
    title: 'Password Reset Failed',
    subtitle:
      'An error occurred while resetting your password. Please try again or request a new link.',
    buttonProps: {
      path: '/forgot-password',
      icon: 'mdi-lock-reset',
      label: 'Reset Password',
    },
  },
  [ResetPasswordStatus.INVALID_LINK]: {
    state: 'warning',
    title: 'Invalid Password Reset Link',
    subtitle:
      'The password reset link is invalid or has expired. Please request a new password reset email.',
  },
}

const stateProps = computed(() => {
  if (resetStatus.value === ResetPasswordStatus.INITIAL) {
    return null
  }

  return componentMap[resetStatus.value]
})

const token = params.token as string

if (!token) {
  resetStatus.value = ResetPasswordStatus.ERROR
}

const passwordRules = [isRequired('Password'), hasMinLength(8), hasNumber]

const confirmPasswordRules = computed(() => [
  isRequired('Password Confirmation'),
  matchesPassword(password.value),
])
</script>
<template>
  <AuthForm title="Reset Password" subtitle="Enter your new password">
    <v-form
      v-if="resetStatus === ResetPasswordStatus.INITIAL"
      ref="form"
      v-model="valid"
      data-testid="reset-password-form"
      @submit.prevent="resetPassword"
    >
      <v-text-field
        type="text"
        autocomplete="username"
        style="display: none"
        tabindex="-1"
        aria-hidden="true"
      />
      <v-text-field
        v-model.trim="password"
        :type="showPassword ? 'text' : 'password'"
        :rules="passwordRules"
        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        label="New Password"
        autocomplete="new-password"
        placeholder="Enter your new password"
        required
        variant="outlined"
        class="mb-4"
        name="password"
        @click:append-inner="showPassword = !showPassword"
      />

      <v-text-field
        v-model.trim="confirmPassword"
        :type="showConfirmPassword ? 'text' : 'password'"
        :rules="confirmPasswordRules"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
        label="Confirm Password"
        autocomplete="new-password"
        placeholder="Confirm your new password"
        required
        variant="outlined"
        class="mb-4"
        name="confirmPassword"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
      />

      <button
        type="submit"
        class="app-btn app-btn-primary app-btn-lg app-btn-block"
        :disabled="isLoading"
      >
        <v-progress-circular v-if="isLoading" size="16" width="2" indeterminate />
        Reset Password
      </button>
    </v-form>
    <GenericState v-else-if="stateProps" :error-message="errorMessage" v-bind="stateProps" />
  </AuthForm>
</template>

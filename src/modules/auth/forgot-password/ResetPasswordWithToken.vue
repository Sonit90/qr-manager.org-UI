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
  {
    component: typeof GenericState
    props: GenericStateProps
  }
> = {
  [ResetPasswordStatus.LOADING]: {
    component: GenericState,
    props: {
      state: 'loading',
      title: 'Resetting your password...',
      subtitle: 'Please wait while we process your password reset request.',
    },
  },
  [ResetPasswordStatus.SUCCESS]: {
    component: GenericState,
    props: {
      state: 'success',
      title: 'Password Reset Successful!',
      subtitle:
        'Your password has been successfully reset. You can now sign in with your new password.',
    },
  },
  [ResetPasswordStatus.ERROR]: {
    component: GenericState,
    props: {
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
  },
  [ResetPasswordStatus.INVALID_LINK]: {
    component: GenericState,
    props: {
      state: 'warning',
      title: 'Invalid Password Reset Link',
      subtitle:
        'The password reset link is invalid or has expired. Please request a new password reset email.',
    },
  },
}

const currentInstance = computed(() => {
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
  isRequired('Please confirm your password'),
  matchesPassword(password.value),
])
</script>
<template>
  <AuthForm title="Reset Password" subtitle="Enter your new password">
    <template v-if="resetStatus === ResetPasswordStatus.INITIAL">
      <v-form ref="form" v-model="valid">
        <v-text-field
          v-model.trim="password"
          :type="showPassword ? 'text' : 'password'"
          :rules="passwordRules"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="New Password"
          placeholder="Enter your new password"
          required
          variant="outlined"
          class="mb-4"
          @click:append-inner="showPassword = !showPassword"
        />

        <v-text-field
          v-model.trim="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          :rules="confirmPasswordRules"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          label="Confirm Password"
          placeholder="Confirm your new password"
          required
          variant="outlined"
          class="mb-4"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
        />
      </v-form>

      <v-btn color="primary" block size="large" :loading="isLoading" @click="resetPassword">
        Reset Password
      </v-btn>
    </template>
    <component
      :is="currentInstance.component"
      v-else-if="currentInstance"
      :error-message="errorMessage"
      v-bind="currentInstance.props"
    />
  </AuthForm>
</template>

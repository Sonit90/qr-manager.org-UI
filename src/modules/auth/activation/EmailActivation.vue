<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { ActivationStatus } from '@/modules/auth/activation/types.ts'
import { useActivation } from '@/modules/auth/activation/useActivation.ts'
import GenericState from '@/components/GenericState.vue'
import type { GenericStateProps } from '@/components/GenericStateProps.ts'

const { activationStatus, errorMessage, isResending, isLoading, params, activateUser } =
  useActivation()

const componentMap: Record<ActivationStatus, GenericStateProps> = {
  [ActivationStatus.LOADING]: {
    state: 'loading',
    title: 'Activating your account...',
    subtitle: 'Please wait while we verify your activation link.',
  },
  [ActivationStatus.SUCCESS]: {
    state: 'success',
    title: 'Email Verified Successfully!',
    subtitle: 'Your email has been verified. You can now sign in and start using our platform.',
    buttonProps: {
      path: '/login',
      label: 'Sign in',
    },
  },
  [ActivationStatus.ERROR]: {
    state: 'error',
    title: 'Verification Failed',
    subtitle: 'An error occurred during email verification. Please try again.',
  },
  [ActivationStatus.INVALID_LINK]: {
    state: 'warning',
    title: 'Invalid Verification Link',
    subtitle:
      'The verification link is invalid or has expired. Please request a new verification email.',
  },
}

const currentInstance = computed(() => componentMap[activationStatus.value])

onMounted(async () => {
  const token = params.token as string

  if (!token) {
    activationStatus.value = ActivationStatus.INVALID_LINK
    isLoading.value = false
    return
  }

  await activateUser(token)
  isLoading.value = false
})

const resendActivation = () => {
  isResending.value = true
  //await resendActivationEmail()
  isResending.value = false
}
</script>
<template>
  <v-container class="activation-container fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="8" rounded="lg">
          <GenericState
            :error-message="errorMessage"
            :is-resending="isResending"
            v-bind="currentInstance"
            @resend-activation="resendActivation()"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.activation-container {
  background-image: linear-gradient(to bottom right, #6366f1, #8b5cf6);
  height: 100%;
}
.fill-height {
  min-height: 100vh;
}
</style>

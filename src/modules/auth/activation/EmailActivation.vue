<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { ActivationStatus } from '@/modules/auth/activation/types.ts'
import { useActivation } from '@/modules/auth/activation/useActivation.ts'
import GenericState from '@/components/GenericState.vue'
import type { GenericStateProps } from '@/components/GenericStateProps.ts'

const { activationStatus, errorMessage, isResending, isLoading, params, activateUser } =
  useActivation()

const componentMap: Record<
  ActivationStatus,
  {
    component: typeof GenericState
    props: GenericStateProps
  }
> = {
  [ActivationStatus.LOADING]: {
    component: GenericState,
    props: {
      state: 'loading',
      title: 'Activating your account...',
      subtitle: 'Please wait while we verify your activation link.',
    },
  },
  [ActivationStatus.SUCCESS]: {
    component: GenericState,
    props: {
      state: 'success',
      title: 'Account Activated Successfully!',
      subtitle:
        'Your account has been successfully activated. You can now sign in and start using our platform.',
      buttonProps: {
        path: '/login',
        label: 'Sign in',
      },
    },
  },
  [ActivationStatus.ERROR]: {
    component: GenericState,
    props: {
      state: 'error',
      title: 'Activation Failed',
      subtitle: 'An error occurred during activation.',
      buttonProps: {
        path: '/forgot-password',
        icon: 'mdi-lock-reset',
        label: 'Reset Password',
      },
    },
  },
  [ActivationStatus.ALREADY_ACTIVATED]: {
    component: GenericState,
    props: {
      state: 'info',
      title: 'Account Already Activated',
      subtitle: 'This account has already been activated. You can sign in using your credentials.',
      buttonProps: {
        path: '/login',
        label: 'Sign in',
      },
    },
  },
  [ActivationStatus.INVALID_LINK]: {
    component: GenericState,
    props: {
      state: 'warning',
      title: 'Invalid Activation Link',
      subtitle:
        'The activation link is invalid or has expired. Please request a new activation email.',
    },
  },
}

const currentInstance = computed(() => componentMap[activationStatus.value])

// Simulate API call for resending activation email
// const resendActivationEmail = async () => {
//   try {
//     const response = await fetch('/api/resend-activation', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         email: params.email || '',
//         userId: params.userId || '',
//       }),
//     })
//
//     if (response.ok) {
//       notify({
//         title: 'Success',
//         text: 'Activation email sent successfully! Please check your inbox.',
//         type: 'success',
//         duration: 5000,
//       })
//     } else {
//       notify({
//         title: 'Error',
//         text: 'Failed to send activation email. Please try again.',
//         type: 'error',
//         duration: 5000,
//       })
//     }
//   } catch {
//     notify({
//       title: 'Error',
//       text: 'Network error occurred. Please try again.',
//       type: 'error',
//       duration: 5000,
//     })
//   }
// }

// Handle activation on component mount
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
          <component
            :is="currentInstance.component"
            :error-message="errorMessage"
            :is-resending="isResending"
            v-bind="currentInstance.props"
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

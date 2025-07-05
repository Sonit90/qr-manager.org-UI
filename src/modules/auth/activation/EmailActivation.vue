<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUrlSearchParams } from '@vueuse/core'
import ActivationLoadingState from '@/modules/auth/activation/states/ActivationLoadingState.vue'
import ActivationErrorState from '@/modules/auth/activation/states/ActivationErrorState.vue'
import AlreadyActivated from '@/modules/auth/activation/states/AlreadyActivated.vue'
import ActivationSuccessState from '@/modules/auth/activation/states/ActivationSuccessState.vue'
import ActivationInvalidLinkState from '@/modules/auth/activation/states/ActivationInvalidLinkState.vue'
import { storeToRefs } from 'pinia'
import { useActivationStore } from '@/stores/activationStore.ts'
import { ActivationStatus } from '@/modules/auth/activation/types.ts'
import { notify } from '@kyvg/vue3-notification'

const activationStore = useActivationStore()

const { activationStatus, errorMessage, isResending, isLoading } = storeToRefs(activationStore)
const componentMap = {
  [ActivationStatus.LOADING]: ActivationLoadingState,
  [ActivationStatus.SUCCESS]: ActivationSuccessState,
  [ActivationStatus.ERROR]: ActivationErrorState,
  [ActivationStatus.ALREADY_ACTIVATED]: AlreadyActivated,
  [ActivationStatus.INVALID_LINK]: ActivationInvalidLinkState,
}
const currentComponent = computed(
  () => componentMap[activationStatus.value] || ActivationLoadingState,
)

// Get URL parameters using VueUse
const params = useUrlSearchParams('history')

// Simulate API call for resending activation email
const resendActivationEmail = async () => {
  try {
    const response = await fetch('/api/resend-activation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: params.email || '',
        userId: params.userId || '',
      }),
    })

    if (response.ok) {
      notify({
        title: 'Success',
        text: 'Activation email sent successfully! Please check your inbox.',
        type: 'success',
        duration: 5000,
      })
    } else {
      notify({
        title: 'Error',
        text: 'Failed to send activation email. Please try again.',
        type: 'error',
        duration: 5000,
      })
    }
  } catch {
    notify({
      title: 'Error',
      text: 'Network error occurred. Please try again.',
      type: 'error',
      duration: 5000,
    })
  }
}

// Handle activation on component mount
onMounted(async () => {
  const token = params.token as string

  if (!token) {
    activationStatus.value = ActivationStatus.INVALID_LINK
    isLoading.value = false
    return
  }

  await activationStore.activateUser(token)
  isLoading.value = false
})

const resendActivation = async () => {
  isResending.value = true
  await resendActivationEmail()
  isResending.value = false
}
</script>
<template>
  <v-container class="activation-container fill-height" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="8" rounded="lg">
          <component
            :is="currentComponent"
            :error-message="errorMessage"
            :is-resending="isResending"
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

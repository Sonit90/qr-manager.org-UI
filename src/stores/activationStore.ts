import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { useUrlSearchParams } from '@vueuse/core'
import { ActivationStatus } from '@/modules/auth/activation/types.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'

export const useActivationStore = defineStore('activation', () => {
  const isLoading = ref(true)
  const isResending = ref(false)
  const activationStatus = ref(ActivationStatus.LOADING)
  const errorMessage = ref('')
  const params = useUrlSearchParams('history')

  async function activateUser(token: string) {
    try {
      isLoading.value = true
      await ApiClientV1.authenticationActivateUser(token)
      activationStatus.value = ActivationStatus.SUCCESS
    } catch (e) {
      const { message } = handleApiError(e, { title: 'Activation Error' })
      activationStatus.value = ActivationStatus.ERROR
      errorMessage.value = message || 'Network error. Please check your connection and try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    activateUser,
    activationStatus,
    errorMessage,
    isLoading,
    isResending,
    params,
  }
})

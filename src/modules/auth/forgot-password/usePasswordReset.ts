import { ref } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { useUrlSearchParams } from '@vueuse/core'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { ResetPasswordStatus } from '@/modules/auth/forgot-password/types.ts'
import { useRouter } from 'vue-router'
import type { VForm } from 'vuetify/components'

export function usePasswordReset() {
  const isLoading = ref(false)
  const resetStatus = ref(ResetPasswordStatus.INITIAL)
  const errorMessage = ref('')
  const params = useUrlSearchParams('history')

  const form = ref<VForm | null>(null)
  const password = ref('')
  const confirmPassword = ref('')
  const router = useRouter()

  async function resetPassword() {
    if (!form.value) return
    const { valid } = await form.value.validate()
    if (!valid) {
      return
    }
    try {
      isLoading.value = true
      resetStatus.value = ResetPasswordStatus.LOADING
      await ApiClientV1.resetPassword({
        token: params.token as string,
        new_password: password.value,
      })
      resetStatus.value = ResetPasswordStatus.SUCCESS
      await router.push('/login')
    } catch (e) {
      const { message } = handleApiError(e, { title: 'Password Reset Error' })
      resetStatus.value = ResetPasswordStatus.ERROR
      errorMessage.value = message || 'Network error. Please check your connection and try again.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    resetPassword,
    resetStatus,
    errorMessage,
    isLoading,
    params,
    form,
    password,
    confirmPassword,
  }
}

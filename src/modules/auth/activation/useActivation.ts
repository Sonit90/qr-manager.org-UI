import { ref, computed } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { useStorage } from '@vueuse/core'
import { useUrlSearchParams } from '@vueuse/core'
import { ActivationStatus } from '@/modules/auth/activation/types.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore.ts'
import { isAxiosError } from 'axios'
import { queryClient } from '@/tanstack/queryClient.ts'
import { fetchUserQuery } from '@/tanstack/useUser.ts'

export const PENDING_EMAIL_KEY = 'pending_activation_email'

export function useActivation() {
  const router = useRouter()
  const userStore = useUserStore()
  const params = useUrlSearchParams('history')

  const storedEmail = useStorage<string>(PENDING_EMAIL_KEY, '')

  const urlEmail = computed(() => (params.email as string) || '')
  const urlCode = computed(() => (params.code as string) || '')

  // URL param takes priority; sync to localStorage so resend works without URL
  const email = computed(() => urlEmail.value || storedEmail.value)

  const status = ref<ActivationStatus>(ActivationStatus.IDLE)
  const errorMessage = ref('')
  const isLoading = ref(false)
  const isResending = ref(false)
  const resendSuccess = ref(false)

  function resolveEmail(): string {
    return urlEmail.value || storedEmail.value
  }

  async function verifyCode(code: string) {
    const resolvedEmail = resolveEmail()
    if (!resolvedEmail) return
    try {
      isLoading.value = true
      errorMessage.value = ''
      status.value = ActivationStatus.LOADING
      await ApiClientV1.verifyEmailCode({ email: resolvedEmail, code })
      status.value = ActivationStatus.SUCCESS
      storedEmail.value = ''
      await queryClient.invalidateQueries({ queryKey: fetchUserQuery.queryKey })
      if (userStore.isAuthenticated) {
        await router.push('/qrs')
      } else {
        await router.push('/login')
      }
    } catch (e) {
      const statusCode = isAxiosError(e) ? e.response?.status : undefined
      handleApiError(e, { title: 'Verification Error' })
      if (statusCode === 429) {
        status.value = ActivationStatus.RATE_LIMITED
        errorMessage.value = 'Too many attempts. Please wait and try again.'
      } else {
        status.value = ActivationStatus.EXPIRED
        errorMessage.value = 'Invalid or expired code. Please try again or request a new one.'
      }
    } finally {
      isLoading.value = false
    }
  }

  async function resendCode() {
    const resolvedEmail = resolveEmail()
    if (!resolvedEmail) return
    try {
      isResending.value = true
      resendSuccess.value = false
      errorMessage.value = ''
      await ApiClientV1.resendVerification({ email: resolvedEmail })
      resendSuccess.value = true
      status.value = ActivationStatus.IDLE
    } catch (e) {
      const statusCode = isAxiosError(e) ? e.response?.status : undefined
      handleApiError(e, { title: 'Resend Error' })
      if (statusCode === 429) {
        errorMessage.value = 'Too many resend attempts. Please wait before trying again.'
      } else {
        errorMessage.value = 'Failed to resend code. Please try again.'
      }
    } finally {
      isResending.value = false
    }
  }

  return {
    email,
    urlCode,
    storedEmail,
    status,
    errorMessage,
    isLoading,
    isResending,
    resendSuccess,
    verifyCode,
    resendCode,
  }
}

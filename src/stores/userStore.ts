import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeLoginReqV1, TypeRegisterReqV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { useStorage } from '@vueuse/core'
import { queryClient } from '@/tanstack/queryClient.ts'

export const useUserStore = defineStore('user', () => {
  const isLoading = ref(false)

  const access_token = useStorage<string | null>('access_token', null)
  const refresh_token = useStorage<string | null>('refresh_token', null)

  const isAuthenticated = computed(() => !!access_token.value)

  async function login(params: TypeLoginReqV1) {
    try {
      isLoading.value = true
      const response = await ApiClientV1.login(params)
      access_token.value = response.access_token
      refresh_token.value = response.refresh_token
    } finally {
      isLoading.value = false
    }
  }

  async function register(params: TypeRegisterReqV1) {
    try {
      isLoading.value = true
      const response = await ApiClientV1.register(params)
      access_token.value = response.access_token
      refresh_token.value = response.refresh_token
    } finally {
      isLoading.value = false
    }
  }

  async function refreshUser() {
    const response = await ApiClientV1.refresh({ refresh_token: refresh_token.value! })
    access_token.value = response.access_token
    refresh_token.value = response.refresh_token
  }

  function clearTokens() {
    access_token.value = null
    refresh_token.value = null
  }

  async function logout() {
    await ApiClientV1.logout({ refresh_token: refresh_token.value! })
    clearTokens()
    queryClient.clear()
  }

  return {
    login,
    logout,
    register,
    clearTokens,
    refreshUser,
    isAuthenticated,
    isLoading,
    access_token,
    refresh_token,
  }
})

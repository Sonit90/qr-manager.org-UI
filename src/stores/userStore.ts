import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type {
  TypeBodyAuthenticationLoginV1,
  TypeUserPublicV1,
  TypeUserRegisterV1,
  TypeUserUpdateMeV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import { useStorage } from '@vueuse/core'

export const useUserStore = defineStore('user', () => {
  const isLoading = ref(false)
  const user = ref<TypeUserPublicV1 | null>(null)

  const access_token = useStorage<string | null>('access_token', null)
  const refresh_token = useStorage<string | null>('refresh_token', null)
  const token_type = useStorage<string | null>('token_type', null)

  const isAuthenticated = computed(() => !!access_token.value)

  async function login(params: TypeBodyAuthenticationLoginV1) {
    try {
      isLoading.value = true
      const response = await ApiClientV1.authenticationLogin(params)
      access_token.value = response.access_token
      refresh_token.value = response.refresh_token
      token_type.value = response.token_type
    } finally {
      isLoading.value = false
    }
  }
  async function register(params: TypeUserRegisterV1) {
    try {
      isLoading.value = true
      user.value = await ApiClientV1.authenticationRegisterUser(params)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser() {
    try {
      isLoading.value = true
      user.value = await ApiClientV1.userGetCurrentUser()
    } finally {
      isLoading.value = false
    }
  }

  async function refreshUser() {
    const response = await ApiClientV1.authenticationRefreshToken({
      headers: {
        Authorization: `Bearer ${refresh_token}`,
      },
    })
    access_token.value = response.access_token
    refresh_token.value = response.refresh_token
    token_type.value = response.token_type
  }

  function clearTokens() {
    access_token.value = null
    refresh_token.value = null
    token_type.value = null
  }

  async function logout() {
    await ApiClientV1.authenticationLogout()
    clearTokens()
  }

  async function editUser(data: TypeUserUpdateMeV1) {
    user.value = await ApiClientV1.userUpdateCurrentUser(data)
  }

  return {
    login,
    logout,
    register,
    fetchUser,
    editUser,
    clearTokens,
    refreshUser,
    isAuthenticated,
    user,
    isLoading,
    access_token,
    refresh_token,
    token_type,
  }
})

import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import {
  type TypeBodyAuthenticationLoginV1,
  type TypeUserPublicV1,
  type TypeUserRegisterV1,
} from '@/api/__generated__/v1/data-contracts.ts'

export const useUserStore = defineStore('user', () => {
  const isLoading = ref(false)
  const user = ref<TypeUserPublicV1 | null>(null)

  const access_token = ref<string | null>(null)
  const refresh_token = ref<string | null>(null)
  const token_type = ref<string | null>(null)

  async function login(params: TypeBodyAuthenticationLoginV1) {
    try {
      isLoading.value = true
      const response = await ApiClientV1.authenticationLogin(params)
      access_token.value = response.access_token
      refresh_token.value = response.refresh_token
      token_type.value = response.token_type
    } catch {
      console.log('Error while login user')
    } finally {
      isLoading.value = false
    }
  }

  async function register(params: TypeUserRegisterV1) {
    try {
      isLoading.value = true
      user.value = await ApiClientV1.authenticationRegisterUser(params)
    } catch {
      console.log('Error while registering user')
    } finally {
      isLoading.value = false
    }
  }

  return { login, register, user, isLoading }
})

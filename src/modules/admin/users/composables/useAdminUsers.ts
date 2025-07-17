import { ref } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import type { TypeUserPublicV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { notify } from '@kyvg/vue3-notification'

const loading = ref(false)
const uploading = ref(false)
const deleteId = ref<string | null>(null)
const users = ref<TypeUserPublicV1[]>([])
const totalUsers = ref(0)

export function useAdminUsers() {
  async function fetchUsers() {
    loading.value = true

    try {
      const { data, total } = await ApiClientV1.adminGetAllUsers({})
      totalUsers.value = total
      users.value = data
    } catch (err) {
      handleApiError(err, { title: 'Users' })
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(userId: string): Promise<void> {
    try {
      deleteId.value = userId
      const { message } = await ApiClientV1.adminDeleteUser(userId)
      notify({ title: message })
    } catch (err) {
      handleApiError(err, { title: 'Delete user' })
    } finally {
      deleteId.value = null
    }
  }
  return {
    fetchUsers,
    deleteUser,
    loading,
    uploading,
    deleteId,
    users,
  }
}

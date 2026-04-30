import { ref } from 'vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { handleApiError } from '@/api/helpers/handleApiError.ts'
import type { TypeRoleV1, TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { notify } from '@kyvg/vue3-notification'

const loading = ref(false)
const users = ref<TypeUserV1[]>([])

export function useAdminUsers() {
  function replaceUserById(id: string, user: TypeUserV1) {
    const idx = users.value.findIndex((u) => u.id === id)
    if (idx !== -1) users.value[idx] = user
  }

  async function fetchUsers() {
    loading.value = true
    try {
      users.value = await ApiClientV1.listUsers({})
    } catch (err) {
      handleApiError(err, { title: 'Users' })
    } finally {
      loading.value = false
    }
  }

  async function updateUser(
    original: TypeUserV1,
    changes: { role?: TypeRoleV1; active?: boolean },
  ) {
    const calls: Promise<void>[] = []
    if (changes.role !== undefined && changes.role !== original.role) {
      calls.push(ApiClientV1.setRole(original.id, { role: changes.role }))
    }
    if (changes.active !== undefined && changes.active !== original.is_active) {
      calls.push(ApiClientV1.setActive(original.id, { active: changes.active }))
    }
    if (calls.length === 0) return
    await Promise.all(calls)
    replaceUserById(original.id, {
      ...original,
      role: changes.role ?? original.role,
      is_active: changes.active ?? original.is_active,
    })
    notify({ title: 'User updated' })
  }

  return {
    fetchUsers,
    updateUser,
    loading,
    users,
  }
}

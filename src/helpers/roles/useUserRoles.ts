import { useUser } from '@/tanstack/useUser.ts'
import type { TypeRoleV1 } from '@/api/__generated__/v1/data-contracts.ts'

export function useUserRoles() {
  const { data: user } = useUser()

  const hasRole = (roles: TypeRoleV1[]) => {
    if (!user.value) return false
    return roles.includes(user.value.role)
  }

  return { hasRole }
}

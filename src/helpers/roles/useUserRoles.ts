import { useUser } from '@/tanstack/useUser.ts'
import type { UserRole } from '@/types/user/roles.ts'

export function useUserRoles() {
  const { data: user } = useUser()

  const hasRole = (roles: UserRole[]) => {
    if (!user.value) return false
    return roles.includes(user.value.role as UserRole)
  }

  return { hasRole }
}

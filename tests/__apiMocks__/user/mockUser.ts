import { vi } from 'vitest'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { type TypeUserV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { generateUser } from './generateUser.ts'

export function mockUser(overrides: Partial<TypeUserV1> = {}) {
  const userResponse = generateUser(overrides)
  const mockedUser = vi.fn().mockResolvedValue(userResponse)
  vi.spyOn(ApiClientV1, 'me').mockImplementation(mockedUser)

  return { mockedUser, userResponse }
}

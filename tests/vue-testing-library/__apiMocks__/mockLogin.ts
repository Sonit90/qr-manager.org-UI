import { vi } from 'vitest'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { TypeTokenV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { generateMockTokenResponse } from './mockData'

export function mockLogin(response?: TypeTokenV1) {
  const tokenResponse = response || generateMockTokenResponse()
  const mockedLogin = vi.fn().mockResolvedValue(tokenResponse)
  vi.spyOn(ApiClientV1, 'authenticationLogin').mockImplementation(mockedLogin)

  return { mockedLogin, tokenResponse }
}

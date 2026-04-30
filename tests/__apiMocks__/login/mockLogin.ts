import { vi } from 'vitest'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { type TypeTokenPairV1 } from '@/api/__generated__/v1/data-contracts.ts'
import { generateMockTokenResponse } from '@tests/__apiMocks__/login/generateLoginData.ts'

export function mockLogin(response?: TypeTokenPairV1) {
  const tokenResponse = response || generateMockTokenResponse()
  const mockedLogin = vi.fn().mockResolvedValue(tokenResponse)
  vi.spyOn(ApiClientV1, 'login').mockImplementation(mockedLogin)

  return { mockedLogin, tokenResponse }
}

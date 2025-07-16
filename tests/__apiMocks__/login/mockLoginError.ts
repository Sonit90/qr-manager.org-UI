import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import type { AxiosError } from 'axios'
import { createAxiosError } from '@tests/helpers/createAxiosError.ts'

export function mockLoginError(error: AxiosError | Error) {
  const mockedLogin = vi.fn().mockRejectedValue(error)
  vi.spyOn(ApiClientV1, 'authenticationLogin').mockImplementation(mockedLogin)

  return { mockedLogin }
}

export function mockLoginUnauthorizedError() {
  const unauthorizedError = createAxiosError('', {
    data: { detail: 'Incorrect email or password' },
    status: 401,
    statusText: 'Unauthorized',
  })

  return mockLoginError(unauthorizedError)
}

export function mockLoginNetworkError() {
  const networkError = new Error('Network Error')
  return mockLoginError(networkError)
}

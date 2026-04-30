import { vi } from 'vitest'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { createAxiosError } from '../../helpers/createAxiosError.ts'

/**
 * Mock successful activation
 */
export function mockActivationSuccess() {
  const mockedActivation = vi.fn().mockResolvedValue({})

  vi.mocked(ApiClientV1.verifyEmail).mockImplementation(mockedActivation)

  return { mockedActivation }
}

/**
 * Mock activation error (generic error)
 */
export function mockActivationError() {
  const mockedActivation = vi.fn().mockRejectedValue(
    createAxiosError('', {
      data: {
        message: 'Activation failed due to server error',
      },
      status: 500,
      statusText: 'Internal Server Error',
    }),
  )

  vi.mocked(ApiClientV1.verifyEmail).mockImplementation(mockedActivation)

  return { mockedActivation }
}

/**
 * Mock activation error for invalid token (400)
 */
export function mockActivationInvalidTokenError() {
  const mockedActivation = vi.fn().mockRejectedValue(
    createAxiosError('', {
      status: 400,
      statusText: 'Bad Request',
      data: {
        message: 'Invalid or expired activation token',
      },
    }),
  )

  vi.mocked(ApiClientV1.verifyEmail).mockImplementation(mockedActivation)

  return { mockedActivation }
}

/**
 * Mock activation error for already activated account (409)
 */
export function mockActivationAlreadyActivatedError() {
  const mockedActivation = vi.fn().mockRejectedValue(
    createAxiosError('', {
      status: 409,
      statusText: 'Conflict',
      data: {
        message: 'Account is already activated',
      },
    }),
  )

  vi.mocked(ApiClientV1.verifyEmail).mockImplementation(mockedActivation)

  return { mockedActivation }
}

/**
 * Mock network error during activation
 */
export function mockActivationNetworkError() {
  const mockedActivation = vi.fn().mockRejectedValue(
    createAxiosError('', {
      status: 0,
      statusText: 'Network Error',
      data: null,
    }),
  )

  vi.mocked(ApiClientV1.verifyEmail).mockImplementation(mockedActivation)

  return { mockedActivation }
}

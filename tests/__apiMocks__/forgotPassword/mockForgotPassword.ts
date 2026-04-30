import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { createAxiosError } from '../../helpers/createAxiosError.ts'

/**
 * Mock successful password reset request
 */
export function mockPasswordResetRequestSuccess() {
  const mockedRequest = vi.fn().mockResolvedValue({
    message: 'Password reset link has been sent to your email',
  })

  vi.spyOn(ApiClientV1, 'forgotPassword').mockImplementation(mockedRequest)

  return { mockedRequest }
}

/**
 * Mock generic error for password reset request
 */
export function mockPasswordResetRequestError() {
  const mockedRequest = vi.fn().mockRejectedValue(
    createAxiosError('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
      data: {
        message: 'Failed to process password reset request',
      },
    }),
  )

  vi.spyOn(ApiClientV1, 'forgotPassword').mockImplementation(mockedRequest)

  return { mockedRequest }
}

/**
 * Mock invalid email error for password reset request
 */
export function mockPasswordResetRequestInvalidEmailError() {
  const mockedRequest = vi.fn().mockRejectedValue(
    createAxiosError('Invalid email format', {
      status: 400,
      statusText: 'Bad Request',
      data: {
        message: 'Invalid email format',
      },
    }),
  )

  vi.spyOn(ApiClientV1, 'forgotPassword').mockImplementation(mockedRequest)

  return { mockedRequest }
}

/**
 * Mock user not found error for password reset request
 */
export function mockPasswordResetRequestUserNotFoundError() {
  const mockedRequest = vi.fn().mockRejectedValue(
    createAxiosError('User not found', {
      status: 404,
      statusText: 'Not Found',
      data: {
        message: 'User with this email does not exist',
      },
    }),
  )

  vi.spyOn(ApiClientV1, 'forgotPassword').mockImplementation(mockedRequest)

  return { mockedRequest }
}

/**
 * Mock network error for password reset request
 */
export function mockPasswordResetRequestNetworkError() {
  const mockedRequest = vi.fn().mockRejectedValue(new Error('Network Error'))

  vi.spyOn(ApiClientV1, 'forgotPassword').mockImplementation(mockedRequest)

  return { mockedRequest }
}

/**
 * Mock successful password reset with token
 */
export function mockPasswordResetSuccess() {
  const mockedReset = vi.fn()

  vi.spyOn(ApiClientV1, 'resetPassword').mockImplementation(mockedReset)

  return { mockedReset }
}

/**
 * Mock generic error for password reset
 */
export function mockPasswordResetError() {
  const mockedReset = vi.fn().mockRejectedValue(
    createAxiosError('Server error', {
      status: 500,
      statusText: 'Internal Server Error',
      data: {
        message: 'Failed to reset password',
      },
    }),
  )

  vi.spyOn(ApiClientV1, 'resetPassword').mockImplementation(mockedReset)

  return { mockedReset }
}

/**
 * Mock invalid token error for password reset
 */
export function mockPasswordResetInvalidTokenError() {
  const mockedReset = vi.fn().mockRejectedValue(
    createAxiosError('Invalid token', {
      status: 400,
      statusText: 'Bad Request',
      data: {
        message: 'Invalid or expired token',
      },
    }),
  )

  vi.spyOn(ApiClientV1, 'resetPassword').mockImplementation(mockedReset)

  return { mockedReset }
}

/**
 * Mock validation error for password reset
 */
export function mockPasswordResetValidationError() {
  const mockedReset = vi.fn().mockRejectedValue(
    createAxiosError('Validation error', {
      status: 422,
      statusText: 'Unprocessable Entity',
      data: {
        detail: [
          {
            loc: ['body', 'new_password'],
            msg: 'Password must be at least 8 characters long',
            type: 'value_error',
          },
        ],
      },
    }),
  )

  vi.spyOn(ApiClientV1, 'resetPassword').mockImplementation(mockedReset)

  return { mockedReset }
}

/**
 * Mock network error for password reset
 */
export function mockPasswordResetNetworkError() {
  const mockedReset = vi.fn().mockRejectedValue(new Error('Network Error'))

  vi.spyOn(ApiClientV1, 'resetPassword').mockImplementation(mockedReset)

  return { mockedReset }
}

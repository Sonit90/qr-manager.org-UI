import { vi } from 'vitest'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { createAxiosError } from '../../helpers/createAxiosError.ts'

export function mockVerifyEmailCodeSuccess() {
  const mockedVerify = vi.fn().mockResolvedValue({ verified: true })
  vi.mocked(ApiClientV1.verifyEmailCode).mockImplementation(mockedVerify)
  return { mockedVerify }
}

export function mockVerifyEmailCodeInvalidCode() {
  const mockedVerify = vi.fn().mockRejectedValue(
    createAxiosError('', {
      status: 400,
      statusText: 'Bad Request',
      data: { message: 'Invalid or expired code' },
    }),
  )
  vi.mocked(ApiClientV1.verifyEmailCode).mockImplementation(mockedVerify)
  return { mockedVerify }
}

export function mockVerifyEmailCodeRateLimited() {
  const mockedVerify = vi.fn().mockRejectedValue(
    createAxiosError('', {
      status: 429,
      statusText: 'Too Many Requests',
      data: { message: 'Too many attempts' },
    }),
  )
  vi.mocked(ApiClientV1.verifyEmailCode).mockImplementation(mockedVerify)
  return { mockedVerify }
}

export function mockVerifyEmailCodeNetworkError() {
  const mockedVerify = vi.fn().mockRejectedValue(
    createAxiosError('', {
      status: 0,
      statusText: 'Network Error',
      data: null,
    }),
  )
  vi.mocked(ApiClientV1.verifyEmailCode).mockImplementation(mockedVerify)
  return { mockedVerify }
}

export function mockResendVerificationSuccess() {
  const mockedResend = vi.fn().mockResolvedValue(undefined)
  vi.mocked(ApiClientV1.resendVerification).mockImplementation(mockedResend)
  return { mockedResend }
}

export function mockResendVerificationRateLimited() {
  const mockedResend = vi.fn().mockRejectedValue(
    createAxiosError('', {
      status: 429,
      statusText: 'Too Many Requests',
      data: { message: 'Rate limited' },
    }),
  )
  vi.mocked(ApiClientV1.resendVerification).mockImplementation(mockedResend)
  return { mockedResend }
}

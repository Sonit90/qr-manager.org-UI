import { within, waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { faker } from '@faker-js/faker'
import { visitRoute } from '../../helpers/visitRoute.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import {
  mockResendVerificationSuccess,
} from '@tests/__apiMocks__/activation/mockActivation.ts'

vi.mock('@/api/v1/ApiClientV1.ts', () => ({
  ApiClientV1: {
    me: vi.fn(),
    resendVerification: vi.fn(),
    verifyEmailCode: vi.fn(),
  },
}))

function generateAccessToken() {
  return faker.string.alphanumeric(32)
}

describe('UserPage — profile info', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', JSON.stringify(generateAccessToken()))
    localStorage.setItem('refresh_token', JSON.stringify(generateAccessToken()))
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('should fetch user info from the backend', async () => {
    const { mockedUser, userResponse } = mockUser()

    const { view } = await visitRoute('/profile')

    await waitFor(() => {
      expect(mockedUser).toHaveBeenCalled()
    })

    const userInfoContainer = view.getByTestId('user-info-container')
    if (userResponse.display_name) {
      within(userInfoContainer).getByText(userResponse.display_name)
    }
    if (userResponse.email) {
      within(userInfoContainer).getByText(userResponse.email)
    }
    within(userInfoContainer).getByText(userResponse.role as string)
  })
})

describe('UserPage — verify email button', () => {
  beforeEach(() => {
    localStorage.setItem('access_token', JSON.stringify(generateAccessToken()))
    localStorage.setItem('refresh_token', JSON.stringify(generateAccessToken()))
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('shows Verify button when email is not verified', async () => {
    mockUser({ email_verified: false })
    mockResendVerificationSuccess()

    const { view } = await visitRoute('/profile')

    await waitFor(() => {
      view.getByRole('button', { name: 'Verify' })
    })
  })

  test('does not show Verify button when email is verified', async () => {
    mockUser({ email_verified: true })

    const { view } = await visitRoute('/profile')

    await waitFor(() => {
      view.getByText('Verified')
    })

    expect(view.queryByRole('button', { name: 'Verify' })).toBeNull()
  })

  test('calls resendVerification with user email when Verify is clicked', async () => {
    const email = faker.internet.email()
    const { mockedResend } = mockResendVerificationSuccess()
    mockUser({ email_verified: false, email })

    const { view, user } = await visitRoute('/profile')

    await waitFor(() => {
      view.getByRole('button', { name: 'Verify' })
    })

    await user.click(view.getByRole('button', { name: 'Verify' }))

    await waitFor(() => {
      expect(mockedResend).toHaveBeenCalledWith({ email })
    })
  })

  test('redirects to /activate after successful resend', async () => {
    mockUser({ email_verified: false })
    mockResendVerificationSuccess()

    const { view, user } = await visitRoute('/profile')

    await waitFor(() => {
      view.getByRole('button', { name: 'Verify' })
    })

    await user.click(view.getByRole('button', { name: 'Verify' }))

    await flushPromises()

    await waitFor(() => {
      expect(window.location.pathname).toBe('/activate')
    })
  })
})

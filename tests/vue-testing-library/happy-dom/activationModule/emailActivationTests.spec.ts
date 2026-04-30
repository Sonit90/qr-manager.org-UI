import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { vi } from 'vitest'
import {
  mockActivationSuccess,
  mockActivationError,
  mockActivationInvalidTokenError,
  mockActivationAlreadyActivatedError,
  mockActivationNetworkError,
} from '@tests/__apiMocks__/activation/mockActivation.ts'
import {
  generateValidActivationToken,
  generateInvalidActivationToken,
  generateActivationUrl,
  generateActivationUrlWithoutToken,
} from '@tests/__apiMocks__/activation/generateActivationData.ts'
import { flushPromises } from '@vue/test-utils'

// Mock the API client
vi.mock('@/api/v1/ApiClientV1.ts', () => ({
  ApiClientV1: {
    verifyEmail: vi.fn(),
  },
}))

describe('EmailActivation Integration Tests', () => {
  test('should show loading state initially when token is present', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    // Mock successful activation but don't resolve immediately
    const { mockedActivation } = mockActivationSuccess()

    const { view } = await visitRoute(activationUrl)

    // Should show loading state initially
    view.getByText('Activating your account...')
    view.getByText('Please wait while we verify your activation link.')

    // Wait for activation to complete
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith({ token })
    })
  })

  test('should show success state after successful activation', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationSuccess()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith({ token })
    })

    await flushPromises()

    expect(view.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
  })

  test('should show error state when activation fails', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationError()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith({ token })
    })

    await flushPromises()

    // Should show error state
    view.getByText('Invalid Verification Link')
    view.getByText(
      'The verification link is invalid or has expired. Please request a new verification email.',
    )
  })

  test('should show invalid link state when no token is provided', async () => {
    const activationUrl = generateActivationUrlWithoutToken()

    const { view } = await visitRoute(activationUrl)

    await flushPromises()

    // Should show an invalid link state
    view.getByText('Invalid Verification Link')
    view.getByText(
      'The verification link is invalid or has expired. Please request a new verification email.',
    )
  })

  test('should show error state when token is invalid', async () => {
    const invalidToken = generateInvalidActivationToken()
    const activationUrl = `/activate?token=${invalidToken}`

    const { mockedActivation } = mockActivationInvalidTokenError()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(view.queryByText('Activating your account...')).not.toBeInTheDocument()
    })

    await flushPromises()

    // Verify API was called with an invalid token
    expect(mockedActivation).toHaveBeenCalledWith({ token: invalidToken })

    // Should show error state for an invalid token
    view.getByText('Invalid Verification Link')
    view.getByText(
      'The verification link is invalid or has expired. Please request a new verification email.',
    )
  })

  test('should show error state when account is already activated', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationAlreadyActivatedError()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(view.queryByText('Activating your account...')).not.toBeInTheDocument()
    })

    await flushPromises()

    // Verify API was called
    expect(mockedActivation).toHaveBeenCalledWith({ token })

    // Should show the error state (current implementation doesn't distinguish between error types)
    view.getByText('Invalid Verification Link')
    view.getByText(
      'The verification link is invalid or has expired. Please request a new verification email.',
    )
  })

  test('should handle network error during activation', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationNetworkError()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith({ token })
    })

    await flushPromises()

    // Should show error state
    view.getByText('Invalid Verification Link')
    view.getByText(
      'The verification link is invalid or has expired. Please request a new verification email.',
    )
  })

  test('should call API with correct token parameter', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationSuccess()

    await visitRoute(activationUrl)

    // Wait for activation to be called
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith({ token })
      expect(mockedActivation).toHaveBeenCalledTimes(1)
    })
  })

  test('should render correct icons for different states', async () => {
    // Test success state icon
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationSuccess()

    const { view } = await visitRoute(activationUrl)

    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith({ token })
    })

    await flushPromises()

    // Should have a success icon
    expect(view.container.querySelector('.mdi-check-circle')).toBeTruthy()
  })

  test('should render warning icon for invalid link state', async () => {
    const activationUrl = generateActivationUrlWithoutToken()

    const { view } = await visitRoute(activationUrl)

    await flushPromises()

    // Should have a warning icon
    expect(view.container.querySelector('.mdi-link-off')).toBeTruthy()
  })
})

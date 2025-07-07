import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { vi } from 'vitest'
import {
  mockActivationSuccess,
  mockActivationError,
  mockActivationInvalidTokenError,
  mockActivationAlreadyActivatedError,
  mockActivationNetworkError,
} from '../../__apiMocks__/mockActivation'
import {
  generateValidActivationToken,
  generateInvalidActivationToken,
  generateActivationUrl,
  generateActivationUrlWithoutToken,
} from '../../__apiMocks__/mockActivationData'
import { flushPromises } from '@vue/test-utils'

// Mock the API client
vi.mock('@/api/v1/ApiClientV1.ts', () => ({
  ApiClientV1: {
    authenticationActivateUser: vi.fn(),
  },
}))

describe('EmailActivation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

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
      expect(mockedActivation).toHaveBeenCalledWith(token)
    })
  })

  test('should show success state after successful activation', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationSuccess()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith(token)
    })

    await flushPromises()

    // Should show success state
    view.getByText('Account Activated Successfully!')
    view.getByText(
      'Your account has been successfully activated. You can now sign in and start using our platform.',
    )

    expect(view.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
  })

  test('should show error state when activation fails', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationError()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith(token)
    })

    await flushPromises()

    // Should show error state
    view.getByText('Activation Failed')
    view.getByText('An error occurred during activation.')
  })

  test('should show invalid link state when no token is provided', async () => {
    const activationUrl = generateActivationUrlWithoutToken()

    const { view } = await visitRoute(activationUrl)

    await flushPromises()

    // Should show an invalid link state
    view.getByText('Invalid Activation Link')
    view.getByText(
      'The activation link is invalid or has expired. Please request a new activation email.',
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
    expect(mockedActivation).toHaveBeenCalledWith(invalidToken)

    // Should show error state for an invalid token
    view.getByText('Activation Failed')
    view.getByText('An error occurred during activation.')
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
    expect(mockedActivation).toHaveBeenCalledWith(token)

    // Should show the error state (current implementation doesn't distinguish between error types)
    view.getByText('Activation Failed')
    view.getByText('An error occurred during activation.')
  })

  test('should handle network error during activation', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationNetworkError()

    const { view } = await visitRoute(activationUrl)

    // Wait for activation to complete
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith(token)
    })

    await flushPromises()

    // Should show error state
    view.getByText('Activation Failed')
    view.getByText('An error occurred during activation.')
  })

  test('should call API with correct token parameter', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationSuccess()

    await visitRoute(activationUrl)

    // Wait for activation to be called
    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith(token)
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
      expect(mockedActivation).toHaveBeenCalledWith(token)
    })

    await flushPromises()

    // Should have a success icon
    expect(view.container.querySelector('.mdi-check-circle')).toBeTruthy()
  })

  test('should render error icon for error states', async () => {
    const token = generateValidActivationToken()
    const activationUrl = generateActivationUrl(token)

    const { mockedActivation } = mockActivationError()

    const { view } = await visitRoute(activationUrl)

    await waitFor(() => {
      expect(mockedActivation).toHaveBeenCalledWith(token)
    })

    await flushPromises()

    // Should have error icon
    expect(view.container.querySelector('.mdi-alert-circle')).toBeTruthy()
  })

  test('should render warning icon for invalid link state', async () => {
    const activationUrl = generateActivationUrlWithoutToken()

    const { view } = await visitRoute(activationUrl)

    await flushPromises()

    // Should have a warning icon
    expect(view.container.querySelector('.mdi-link-off')).toBeTruthy()
  })
})

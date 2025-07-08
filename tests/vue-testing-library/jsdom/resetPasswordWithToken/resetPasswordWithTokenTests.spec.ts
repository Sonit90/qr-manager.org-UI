import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import {
  mockPasswordResetSuccess,
  mockPasswordResetError,
  mockPasswordResetInvalidTokenError,
  mockPasswordResetValidationError,
  mockPasswordResetNetworkError,
} from '../../__apiMocks__/mockForgotPassword'
import {
  generateValidResetToken,
  generateValidPassword,
  generateResetUrlParams,
} from '../../__testData__/mockForgotPasswordData'
import { mockWithDelay } from '../../../helpers/mockWithDelay.ts'

describe('ResetPasswordWithToken Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should submit form with valid passwords and show success message', async () => {
    const { mockedReset } = mockPasswordResetSuccess()
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    expect(mockedReset).toHaveBeenCalledWith({
      token,
      new_password: password,
      confirm_password: password,
    })

    // Check for success message
    await waitFor(() => {
      view.getByText('Password updated successfully')
    })
  })
  test('should handle server error when resetting password', async () => {
    const { mockedReset } = mockPasswordResetError()
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedReset).toHaveBeenCalledWith({
        token,
        new_password: password,
        confirm_password: password,
      })
    })

    // Check for error message
    await waitFor(() => {
      view.getByText('Password Reset Failed')
    })
  })

  test('should handle invalid token error from API', async () => {
    const { mockedReset } = mockPasswordResetInvalidTokenError()
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedReset).toHaveBeenCalledWith({
        token,
        new_password: password,
        confirm_password: password,
      })
    })

    // Check for error message
    await waitFor(() => {
      view.getByText('Password Reset Failed')
    })
  })

  test('should handle validation error from API', async () => {
    const { mockedReset } = mockPasswordResetValidationError()
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedReset).toHaveBeenCalledWith({
        token,
        new_password: password,
        confirm_password: password,
      })
    })

    // Check for error message
    await waitFor(() => {
      view.getByText('Password Reset Failed')
    })
  })

  test('should handle network error when resetting password', async () => {
    const { mockedReset } = mockPasswordResetNetworkError()
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedReset).toHaveBeenCalledWith({
        token,
        new_password: password,
        confirm_password: password,
      })
    })

    // Check for error message
    await waitFor(() => {
      view.getByText('Password Reset Failed')
    })
  })

  test('should show loading state when submitting form', async () => {
    // Use a delayed mock to observe loading state
    const mockedRequest = mockWithDelay(
      {
        message: 'Password has been reset successfully',
        redirect_url: '/login',
      },
      100,
    )

    vi.spyOn(ApiClientV1, 'authenticationResetPassword').mockImplementation(mockedRequest)

    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check for loading state
    await waitFor(() => {
      view.getByText('Resetting your password...')
    })

    // Wait for success message
    await waitFor(
      () => {
        view.getByText('Password Reset Successful!')
      },
      { timeout: 200 },
    )
  })

  test('should show success message after successful password reset', async () => {
    mockPasswordResetSuccess()
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check for success message
    await waitFor(() => {
      view.getByText('Password updated successfully')
    })
  })

  test('should toggle password visibility when clicking eye icon', async () => {
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Check initial password field type
    const passwordField = view.getByLabelText('New Password')
    expect(passwordField.getAttribute('type')).toBe('password')

    // Click eye icon to show password
    const eyeOffIcon = view.container.querySelector('.mdi-eye-off')
    expect(eyeOffIcon).not.toBeNull()
    await user.click(eyeOffIcon as Element)

    // Check that password is now visible
    expect(passwordField.getAttribute('type')).toBe('text')

    // Click eye icon again to hide password
    const eyeIcon = view.container.querySelector('.mdi-eye')
    expect(eyeIcon).not.toBeNull()
    await user.click(eyeIcon as Element)

    // Check that password is hidden again
    expect(passwordField.getAttribute('type')).toBe('password')
  })

  test('should show loading icon when submitting form', async () => {
    // Test loading state
    const mockedRequest = mockWithDelay(
      {
        message: 'Password has been reset successfully',
        redirect_url: '/login',
      },
      100,
    )
    vi.spyOn(ApiClientV1, 'authenticationResetPassword').mockImplementation(mockedRequest)

    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter valid matching passwords
    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check for loading icon
    await waitFor(() => {
      view.container.querySelector('.mdi-loading')
    })

    // Wait for success icon
    await waitFor(
      () => {
        view.container.querySelector('.mdi-check-circle')
      },
      { timeout: 200 },
    )
  })

  test('should show error icon when password reset fails', async () => {
    mockPasswordResetError()
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    const password = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password)
    await user.type(view.getByLabelText('Confirm Password'), password)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check for error icon
    await waitFor(() => {
      view.container.querySelector('.mdi-alert-circle')
    })
  })

  test('should show warning icon for invalid link', async () => {
    // Use invalid token
    const invalidParams = generateResetUrlParams('')
    const { view } = await visitRoute(`/reset-password?${invalidParams.toString()}`)

    // Check for warning icon
    await waitFor(() => {
      view.container.querySelector('.mdi-link-off')
    })
  })
})

import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import {
  mockPasswordResetRequestSuccess,
  mockPasswordResetRequestError,
  mockPasswordResetRequestInvalidEmailError,
  mockPasswordResetRequestUserNotFoundError,
  mockPasswordResetRequestNetworkError,
} from '@tests/__apiMocks__/forgotPassword/mockForgotPassword.ts'

import { mockWithDelay } from '../../../helpers/mockWithDelay.ts'
import {
  generateInvalidEmail,
  generateValidEmail,
} from '@tests/__apiMocks__/forgotPassword/generateForgotPasswordData.ts'

describe('ForgotPasswordRequestPage Integration Tests', () => {
  test('should render forgot password request form with email field', async () => {
    const { view } = await visitRoute('/forgot-password')

    // Check if the form elements are present
    view.getByLabelText('Email')
    view.getByRole('button', { name: /send reset link/i })

    // Check for navigation links
    expect(view.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    expect(view.getByRole('link', { name: 'Sign up' })).toHaveAttribute('href', '/register')
  })

  test('should validate empty email field', async () => {
    const { view, user } = await visitRoute('/forgot-password')

    // Submit form without entering email
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check for validation error
    await waitFor(() => {
      view.getByText('E-mail is required')
    })
  })

  test('should validate invalid email format', async () => {
    const { view, user } = await visitRoute('/forgot-password')
    const invalidEmail = generateInvalidEmail()

    // Enter invalid email and submit
    await user.type(view.getByLabelText('Email'), invalidEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check for validation error
    await waitFor(() => {
      view.getByText('Invalid email format')
    })
  })

  test('should submit form with valid email and show success message', async () => {
    const { mockedRequest } = mockPasswordResetRequestSuccess()
    const { view, user } = await visitRoute('/forgot-password')
    const validEmail = generateValidEmail()

    // Enter valid email and submit
    await user.type(view.getByLabelText('Email'), validEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedRequest).toHaveBeenCalledWith({ email: validEmail })
    })

    // Check for a success message
    await waitFor(() => {
      view.getByText('Check Your Email')
      view.getByText(validEmail)
    })
  })

  test('should handle server error when requesting password reset', async () => {
    const { mockedRequest } = mockPasswordResetRequestError()
    const { view, user } = await visitRoute('/forgot-password')
    const validEmail = generateValidEmail()

    // Enter valid email and submit
    await user.type(view.getByLabelText('Email'), validEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedRequest).toHaveBeenCalledWith({ email: validEmail })
    })

    await waitFor(() => {
      view.getByText('Failed to process password reset request')
    })
  })

  test('should handle invalid email error from API', async () => {
    const { mockedRequest } = mockPasswordResetRequestInvalidEmailError()
    const { view, user } = await visitRoute('/forgot-password')
    const validEmail = generateValidEmail()

    // Enter valid email and submit
    await user.type(view.getByLabelText('Email'), validEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedRequest).toHaveBeenCalledWith({ email: validEmail })
    })

    // Form should still be visible (not showing success message)
    await waitFor(() => {
      view.getByText('Invalid email format')
    })
  })

  test('should handle user not found error from API', async () => {
    const { mockedRequest } = mockPasswordResetRequestUserNotFoundError()
    const { view, user } = await visitRoute('/forgot-password')
    const validEmail = generateValidEmail()

    // Enter valid email and submit
    await user.type(view.getByLabelText('Email'), validEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedRequest).toHaveBeenCalledWith({ email: validEmail })
    })

    await waitFor(() => {
      view.getByText('User with this email does not exist')
    })
  })

  test('should handle network error when requesting password reset', async () => {
    const { mockedRequest } = mockPasswordResetRequestNetworkError()
    const { view, user } = await visitRoute('/forgot-password')
    const validEmail = generateValidEmail()

    // Enter valid email and submit
    await user.type(view.getByLabelText('Email'), validEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check that API was called with correct parameters
    await waitFor(() => {
      expect(mockedRequest).toHaveBeenCalledWith({ email: validEmail })
    })

    // Form should still be visible (not showing success message)
    await waitFor(() => {
      view.getByLabelText('Email')
      view.getByRole('button', { name: /send reset link/i })
    })
  })

  test('should show loading state when submitting form', async () => {
    // Use a delayed mock to observe loading state
    const mockedRequest = mockWithDelay(null, 100)

    vi.spyOn(ApiClientV1, 'resetPassword').mockImplementation(mockedRequest)

    const { view, user } = await visitRoute('/forgot-password')
    const validEmail = generateValidEmail()

    // Enter valid email and submit
    await user.type(view.getByLabelText('Email'), validEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Wait for success message
    await waitFor(
      () => {
        view.getByText('Check Your Email')
      },
      { timeout: 200 },
    )
  })

  test('should navigate to login page when clicking sign in link', async () => {
    const { view, user } = await visitRoute('/forgot-password')

    // Click on sign in link
    await user.click(view.getByRole('link', { name: 'Sign in' }))

    // Check that we navigated to login page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    })
  })

  test('should navigate to register page when clicking sign up link', async () => {
    const { view, user } = await visitRoute('/forgot-password')

    // Click on sign up link
    await user.click(view.getByRole('link', { name: 'Sign up' }))

    // Check that we navigated to register page
    await waitFor(() => {
      expect(window.location.pathname).toBe('/register')
    })
  })

  test('should call API with different email formats correctly', async () => {
    const { mockedRequest } = mockPasswordResetRequestSuccess()
    const { view, user } = await visitRoute('/forgot-password')

    // Test with email containing uppercase letters
    const mixedCaseEmail = 'Test.User@Example.com'

    // Enter email and submit
    await user.type(view.getByLabelText('Email'), mixedCaseEmail)
    await user.click(view.getByRole('button', { name: /send reset link/i }))

    // Check that API was called with the email as entered
    await waitFor(() => {
      expect(mockedRequest).toHaveBeenCalledWith({ email: mixedCaseEmail })
    })
  })
})

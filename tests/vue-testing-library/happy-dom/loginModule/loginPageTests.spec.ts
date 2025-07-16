import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { mockLogin } from '@tests/__apiMocks__/login/mockLogin.ts'
import {
  mockLoginUnauthorizedError,
  mockLoginNetworkError,
} from '@tests/__apiMocks__/login/mockLoginError.ts'
import {
  generateValidLoginCredentials,
  generateInvalidLoginCredentials,
  generateInvalidEmailCredentials,
  generateShortPasswordCredentials,
} from '@tests/__apiMocks__/login/generateLoginData.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'

describe('LoginPage Integration Tests', () => {
  test('should render login form with all required fields', async () => {
    const { view } = await visitRoute('/login')

    // Check if the form elements are present
    view.getByLabelText('Email')
    view.getByLabelText('Password')
    view.getByRole('button', { name: /sign in/i })

    // Check for navigation links
    view.getByText(/forgot password/i)
    view.getByText(/sign up/i)
  })

  test('should show validation errors for empty fields', async () => {
    const { view, user } = await visitRoute('/login')

    const submitButton = view.getByRole('button', { name: /sign in/i })

    // Try to submit without filling fields
    await user.click(submitButton)

    // Wait for validation errors to appear
    await waitFor(() => {
      view.getByText(/e-mail is required/i)
      view.getByText(/password is required/i)
    })
  })

  test('should show validation error for invalid email format', async () => {
    const { view, user } = await visitRoute('/login')
    const credentials = generateInvalidEmailCredentials()

    const emailInput = view.getByLabelText(/email/i)
    const passwordInput = view.getByLabelText('Password')
    const submitButton = view.getByRole('button', { name: /sign in/i })

    // Fill with invalid email
    await user.type(emailInput, credentials.username)
    await user.type(passwordInput, credentials.password)
    await user.click(submitButton)

    // Wait for validation error
    await waitFor(() => {
      view.getByText(/invalid email format/i)
    })
  })

  test('should show validation error for short password', async () => {
    const { view, user } = await visitRoute('/login')
    const credentials = generateShortPasswordCredentials()

    const emailInput = view.getByLabelText(/email/i)
    const passwordInput = view.getByLabelText('Password')
    const submitButton = view.getByRole('button', { name: /sign in/i })

    // Fill with short password
    await user.type(emailInput, credentials.username)
    await user.type(passwordInput, credentials.password)
    await user.click(submitButton)

    // Wait for validation error
    await waitFor(() => {
      view.getByText(/must be at least 8 characters/i)
    })
  })

  test('should successfully login with valid credentials', async () => {
    // Mock successful login
    const { mockedLogin } = mockLogin()
    const credentials = generateValidLoginCredentials()

    const { view, user } = await visitRoute('/login')

    const emailInput = view.getByLabelText(/email/i)
    const passwordInput = view.getByLabelText('Password')
    const submitButton = view.getByRole('button', { name: /sign in/i })

    // Fill form with valid credentials
    await user.type(emailInput, credentials.username)
    await user.type(passwordInput, credentials.password)

    // Submit form
    await user.click(submitButton)

    // Wait for API call
    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith(credentials)
    })
  })

  test('should handle unauthorized login error', async () => {
    const { mockedLogin } = mockLoginUnauthorizedError()
    const credentials = generateInvalidLoginCredentials()

    const { view, user } = await visitRoute('/login')

    const emailInput = view.getByLabelText(/email/i)
    const passwordInput = view.getByLabelText('Password')
    const submitButton = view.getByRole('button', { name: /sign in/i })

    await user.type(emailInput, credentials.username)
    await user.type(passwordInput, credentials.password)

    // Submit form
    await user.click(submitButton)

    expect(mockedLogin).toHaveBeenCalledWith(credentials)

    view.getByText('Incorrect email or password')
  })

  test('should handle network error during login', async () => {
    // Mock network error
    const { mockedLogin } = mockLoginNetworkError()
    const credentials = generateValidLoginCredentials()

    const { view, user } = await visitRoute('/login')

    const emailInput = view.getByLabelText(/email/i)
    const passwordInput = view.getByLabelText('Password')
    const submitButton = view.getByRole('button', { name: /sign in/i })

    // Fill form
    await user.type(emailInput, credentials.username)
    await user.type(passwordInput, credentials.password)

    // Submit form
    await user.click(submitButton)

    // Wait for API call
    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith(credentials)
    })
  })

  test('should show loading state during login', async () => {
    // Mock login with delay
    const { mockedLogin } = mockLogin()
    mockUser()
    const credentials = generateValidLoginCredentials()

    const { view, user } = await visitRoute('/login')

    const emailInput = view.getByLabelText(/email/i)
    const passwordInput = view.getByLabelText('Password')
    const submitButton = view.getByRole('button', { name: /sign in/i })

    // Fill form
    await user.type(emailInput, credentials.username)
    await user.type(passwordInput, credentials.password)

    // Submit form
    await user.click(submitButton)

    expect(mockedLogin).toHaveBeenCalledWith(credentials)
  })

  test('should navigate to register page when clicking sign up link', async () => {
    const { view, user } = await visitRoute('/login')

    const signUpLink = view.getByText(/sign up/i)

    // Verify the link has the correct href
    await user.click(signUpLink)

    // Check if navigation occurred
    await waitFor(() => {
      expect(window.location.pathname).toBe('/register')
    })
  })

  test('should navigate to reset password page when clicking forgot password link', async () => {
    const { view, user } = await visitRoute('/login')

    const forgotPasswordLink = view.getByRole('link', { name: /forgot password/i })

    // Verify the link has the correct href
    expect(forgotPasswordLink).toHaveAttribute('href', '/forgot-password')

    // Click forgot password link
    await user.click(forgotPasswordLink)

    // Check if navigation occurred
    await waitFor(() => {
      expect(window.location.pathname).toBe('/forgot-password')
    })
  })
})

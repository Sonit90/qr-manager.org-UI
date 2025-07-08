import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import {
  generateValidResetToken,
  generateValidPassword,
  generateWeakPassword,
  generateResetUrlParams,
} from '../../__testData__/mockForgotPasswordData'

describe('ResetPasswordWithToken Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('should render password reset form with valid token', async () => {
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view } = await visitRoute(`/reset-password?${params.toString()}`)

    // Check if the form elements are present
    view.getByLabelText('New Password')
    view.getByLabelText('Confirm Password')
    view.getByRole('button', { name: /reset password/i })
  })

  test('should validate empty password fields', async () => {
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Submit form without entering passwords
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check for validation errors
    await waitFor(() => {
      view.getByText('Password is required')
      view.getByText('Password Confirmation is required')
    })
  })

  test('should validate password mismatch', async () => {
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter different passwords
    const password1 = generateValidPassword()
    const password2 = generateValidPassword()

    await user.type(view.getByLabelText('New Password'), password1)
    await user.type(view.getByLabelText('Confirm Password'), password2)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check for validation error
    await waitFor(() => {
      view.getByText('Passwords do not match')
    })
  })

  test('should validate weak password', async () => {
    const token = generateValidResetToken()
    const params = generateResetUrlParams(token)
    const { view, user } = await visitRoute(`/reset-password?${params.toString()}`)

    // Enter weak password
    const weakPassword = generateWeakPassword()

    await user.type(view.getByLabelText('New Password'), weakPassword)
    await user.type(view.getByLabelText('Confirm Password'), weakPassword)
    await user.click(view.getByRole('button', { name: /reset password/i }))

    // Check for validation error
    await waitFor(() => {
      view.getByText('Must be at least 8 characters')
    })
  })
})

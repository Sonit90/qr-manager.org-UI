import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { faker } from '@faker-js/faker'
import {
  mockVerifyEmailCodeSuccess,
  mockVerifyEmailCodeInvalidCode,
  mockVerifyEmailCodeRateLimited,
  mockVerifyEmailCodeNetworkError,
  mockResendVerificationSuccess,
  mockResendVerificationRateLimited,
} from '@tests/__apiMocks__/activation/mockActivation.ts'
import { generateVerificationEmail, generateValidCode } from '@tests/__apiMocks__/activation/generateActivationData.ts'
import { PENDING_EMAIL_KEY } from '@/modules/auth/activation/useActivation.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { mockListQrs } from '@tests/__apiMocks__/qr/mockQr.ts'

vi.mock('@/api/v1/ApiClientV1.ts', () => ({
  ApiClientV1: {
    verifyEmailCode: vi.fn(),
    resendVerification: vi.fn(),
    me: vi.fn(),
  },
}))

function generateAccessToken() {
  return faker.string.alphanumeric(32)
}

describe('EmailActivation — unauthenticated user', () => {
  let email: string

  beforeEach(() => {
    email = generateVerificationEmail()
    localStorage.setItem(PENDING_EMAIL_KEY, email)
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('renders OTP input with 6 digit boxes', async () => {
    mockVerifyEmailCodeSuccess()

    const { view } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    expect(inputs).toHaveLength(6)
  })

  test('displays stored email', async () => {
    mockVerifyEmailCodeSuccess()

    const { view } = await visitRoute('/activate')

    view.getByText(email)
  })

  test('submit button disabled until all 6 digits entered', async () => {
    mockVerifyEmailCodeSuccess()

    const { view, user } = await visitRoute('/activate')

    const submitBtn = view.getByRole('button', { name: /verify email/i })
    expect(submitBtn).toBeDisabled()

    const inputs = view.getAllByRole('textbox')
    await user.type(inputs[0], '1')
    await user.type(inputs[1], '2')
    await user.type(inputs[2], '3')

    expect(submitBtn).toBeDisabled()
  })

  test('submit button enabled when all 6 digits filled', async () => {
    mockVerifyEmailCodeSuccess()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1))
    }

    const submitBtn = view.getByRole('button', { name: /verify email/i })
    expect(submitBtn).not.toBeDisabled()
  })

  test('paste fills all digits at once', async () => {
    mockVerifyEmailCodeSuccess()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await waitFor(() => {
      code.split('').forEach((digit, i) => {
        expect((inputs[i] as HTMLInputElement).value).toBe(digit)
      })
    })
  })

  test('calls verifyEmailCode with email and code on submit', async () => {
    const { mockedVerify } = mockVerifyEmailCodeSuccess()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    const submitBtn = view.getByRole('button', { name: /verify email/i })
    await user.click(submitBtn)

    await waitFor(() => {
      expect(mockedVerify).toHaveBeenCalledWith({ email, code })
    })
  })

  test('redirects to /login after successful verification (unauthenticated)', async () => {
    mockVerifyEmailCodeSuccess()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await user.click(view.getByRole('button', { name: /verify email/i }))

    await flushPromises()

    await waitFor(() => {
      expect(window.location.pathname).toBe('/login')
    })
  })

  test('shows error message for invalid/expired code (400)', async () => {
    mockVerifyEmailCodeInvalidCode()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await user.click(view.getByRole('button', { name: /verify email/i }))

    await flushPromises()

    await waitFor(() => {
      view.getByText('Invalid or expired code. Please try again or request a new one.')
    })
  })

  test('shows rate limit error message (429)', async () => {
    mockVerifyEmailCodeRateLimited()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await user.click(view.getByRole('button', { name: /verify email/i }))

    await flushPromises()

    await waitFor(() => {
      view.getByText('Too many attempts. Please wait and try again.')
    })
  })

  test('submit button disabled when rate limited', async () => {
    mockVerifyEmailCodeRateLimited()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await user.click(view.getByRole('button', { name: /verify email/i }))

    await flushPromises()

    await waitFor(() => {
      expect(view.getByRole('button', { name: /verify email/i })).toBeDisabled()
    })
  })

  test('shows error for network failure', async () => {
    mockVerifyEmailCodeNetworkError()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await user.click(view.getByRole('button', { name: /verify email/i }))

    await flushPromises()

    await waitFor(() => {
      view.getByText('Invalid or expired code. Please try again or request a new one.')
    })
  })

  test('resend button calls resendVerification with email', async () => {
    mockVerifyEmailCodeSuccess()
    const { mockedResend } = mockResendVerificationSuccess()

    const { view, user } = await visitRoute('/activate')

    await user.click(view.getByRole('button', { name: /resend code/i }))

    await waitFor(() => {
      expect(mockedResend).toHaveBeenCalledWith({ email })
    })
  })

  test('shows success message after resend', async () => {
    mockVerifyEmailCodeSuccess()
    mockResendVerificationSuccess()

    const { view, user } = await visitRoute('/activate')

    await user.click(view.getByRole('button', { name: /resend code/i }))

    await flushPromises()

    await waitFor(() => {
      view.getByText(/new code sent/i)
    })
  })

  test('shows error when resend is rate limited', async () => {
    mockVerifyEmailCodeSuccess()
    mockResendVerificationRateLimited()

    const { view, user } = await visitRoute('/activate')

    await user.click(view.getByRole('button', { name: /resend code/i }))

    await flushPromises()

    await waitFor(() => {
      view.getByText('Too many resend attempts. Please wait before trying again.')
    })
  })
})

describe('EmailActivation — authenticated user', () => {
  let email: string

  mockUser()
  mockListQrs([])

  beforeEach(() => {
    email = generateVerificationEmail()
    localStorage.setItem(PENDING_EMAIL_KEY, email)
    localStorage.setItem('access_token', JSON.stringify(generateAccessToken()))
    localStorage.setItem('refresh_token', JSON.stringify(generateAccessToken()))
  })

  afterEach(() => {
    localStorage.clear()
  })

  test('renders OTP form for authenticated user', async () => {
    mockVerifyEmailCodeSuccess()

    const { view } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    expect(inputs).toHaveLength(6)
    view.getByText(email)
  })

  test('redirects to /qrs after successful verification (authenticated)', async () => {
    mockVerifyEmailCodeSuccess()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await user.click(view.getByRole('button', { name: /verify email/i }))

    await flushPromises()

    await waitFor(() => {
      expect(window.location.pathname).toBe('/qrs')
    })
  })

  test('calls verifyEmailCode with correct email and code (authenticated)', async () => {
    const { mockedVerify } = mockVerifyEmailCodeSuccess()
    const code = generateValidCode()

    const { view, user } = await visitRoute('/activate')

    const inputs = view.getAllByRole('textbox')
    await user.click(inputs[0])
    await user.paste(code)

    await user.click(view.getByRole('button', { name: /verify email/i }))

    await waitFor(() => {
      expect(mockedVerify).toHaveBeenCalledWith({ email, code })
    })
  })
})

describe('EmailActivation — email link (URL params)', () => {
  afterEach(() => {
    localStorage.clear()
  })

  test('displays email from URL param when no localStorage email', async () => {
    mockVerifyEmailCodeSuccess()
    const email = generateVerificationEmail()
    const code = generateValidCode()

    const { view } = await visitRoute(`/activate?email=${encodeURIComponent(email)}&code=${code}`)

    // Check email before auto-submit redirect completes
    view.getByText(email)
  })

  test('auto-submits with email and code from URL params', async () => {
    const { mockedVerify } = mockVerifyEmailCodeSuccess()
    const email = generateVerificationEmail()
    const code = generateValidCode()

    await visitRoute(`/activate?email=${encodeURIComponent(email)}&code=${code}`)

    await flushPromises()

    await waitFor(() => {
      expect(mockedVerify).toHaveBeenCalledWith({ email, code })
    })
  })

  test('URL email takes priority over localStorage email', async () => {
    const { mockedVerify } = mockVerifyEmailCodeSuccess()
    const localEmail = generateVerificationEmail()
    const urlEmail = generateVerificationEmail()
    const code = generateValidCode()

    localStorage.setItem(PENDING_EMAIL_KEY, localEmail)

    await visitRoute(`/activate?email=${encodeURIComponent(urlEmail)}&code=${code}`)

    await flushPromises()

    await waitFor(() => {
      expect(mockedVerify).toHaveBeenCalledWith({ email: urlEmail, code })
    })
  })

  test('does not auto-submit when URL code is not 6 digits', async () => {
    const { mockedVerify } = mockVerifyEmailCodeSuccess()
    const email = generateVerificationEmail()

    const { view } = await visitRoute(`/activate?email=${encodeURIComponent(email)}&code=123`)

    await flushPromises()

    expect(mockedVerify).not.toHaveBeenCalled()
    const inputs = view.getAllByRole('textbox')
    expect(inputs).toHaveLength(6)
  })

  test('shows error when URL code is invalid (400)', async () => {
    mockVerifyEmailCodeInvalidCode()
    const email = generateVerificationEmail()
    const code = generateValidCode()

    const { view } = await visitRoute(`/activate?email=${encodeURIComponent(email)}&code=${code}`)

    await flushPromises()

    await waitFor(() => {
      view.getByText('Invalid or expired code. Please try again or request a new one.')
    })
  })
})

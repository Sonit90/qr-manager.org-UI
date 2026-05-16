import { visitRoute } from '../../helpers/visitRoute.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { faker } from '@faker-js/faker'

describe('LandingPage Integration Tests', () => {
  test('should render app name and tagline', async () => {
    const { view } = await visitRoute('/')

    view.getByRole('heading', { name: 'QR Manager' })
    view.getByText(/dynamic qr codes/i)
  })

  test('should render all feature cards', async () => {
    const { view } = await visitRoute('/')

    view.getByText('Create QR Codes')
    view.getByText('Track Scans')
    view.getByText('Update Targets')
    view.getByText('Enable / Disable')
  })

  test('should show Sign in and Create account links when not authenticated', async () => {
    const { view } = await visitRoute('/')

    expect(view.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login')
    expect(view.getByRole('link', { name: 'Create account' })).toHaveAttribute('href', '/register')
  })

  test('should show Go to My QRs CTA when authenticated', async () => {
    const { view } = await visitRoute('/')
    const userStore = useUserStore()
    userStore.access_token = faker.string.alphanumeric(32)

    await view.rerender({})

    expect(view.getByRole('link', { name: /go to my qrs/i })).toHaveAttribute('href', '/qrs')
  })

  test('should not show auth links when authenticated', async () => {
    const { view } = await visitRoute('/')
    const userStore = useUserStore()
    userStore.access_token = faker.string.alphanumeric(32)

    await view.rerender({})

    expect(view.queryByRole('link', { name: 'Create account' })).not.toBeInTheDocument()
  })
})

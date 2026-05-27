import { visitRoute } from '../../helpers/visitRoute.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { faker } from '@faker-js/faker'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'

function generateAccessToken() {
  return faker.string.alphanumeric(32)
}

mockUser()

describe('LandingPage Integration Tests', () => {
  test('should render hero headline and subheadline', async () => {
    const { view } = await visitRoute('/')

    view.getByRole('heading', { level: 1, name: /dynamic qr codes/i })
    view.getByText(/create free qr codes with editable destinations/i)
  })

  test('should render all four feature cards', async () => {
    const { view } = await visitRoute('/')

    view.getByRole('heading', { level: 3, name: 'Edit Destination Anytime' })
    view.getByRole('heading', { level: 3, name: 'Disable or Reactivate' })
    view.getByRole('heading', { level: 3, name: 'Unlimited QR Codes' })
    view.getByRole('heading', { level: 3, name: 'Completely Free' })
  })

  test('should render how it works steps', async () => {
    const { view } = await visitRoute('/')

    view.getByRole('heading', { level: 3, name: 'Create a QR code' })
    view.getByRole('heading', { level: 3, name: 'Share or print it anywhere' })
    view.getByRole('heading', { level: 3, name: 'Update the destination whenever needed' })
  })

  test('should render social proof stats', async () => {
    const { view } = await visitRoute('/')

    view.getByText('50,000+')
    view.getByText('10,000+')
    view.getByText('99.99%')
  })

  test('should render FAQ questions', async () => {
    const { view } = await visitRoute('/')

    view.getByText('Are dynamic QR codes really free?')
    view.getByText('Can I change the link later?')
    view.getByText('Can I disable a QR code temporarily?')
    view.getByText('Is there a limit on QR codes?')
  })

  test('should render footer links', async () => {
    const { view } = await visitRoute('/')

    expect(view.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(view.getByRole('link', { name: 'Terms of Service' })).toHaveAttribute('href', '/terms')
    expect(view.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  test('should show Login and Register header links when not authenticated', async () => {
    const { view } = await visitRoute('/')

    expect(view.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/login')
    expect(view.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register')
  })

  test('should show primary CTA pointing to register when not authenticated', async () => {
    const { view } = await visitRoute('/')

    const ctas = view.getAllByRole('link', { name: /create free qr code/i })
    expect(ctas.length).toBeGreaterThan(0)
    for (const cta of ctas) {
      expect(cta).toHaveAttribute('href', '/register')
    }
  })

  test('should render secondary CTA linking to how it works section', async () => {
    const { view } = await visitRoute('/')

    expect(view.getByRole('link', { name: /see how it works/i })).toHaveAttribute(
      'href',
      '/#how-it-works',
    )
  })

  test('should show Go to My QRs CTA when authenticated', async () => {
    const { view } = await visitRoute('/')
    const userStore = useUserStore()
    userStore.access_token = generateAccessToken()

    await view.rerender({})

    const authedCtas = view.getAllByRole('link', { name: /go to my qrs/i })
    expect(authedCtas.length).toBeGreaterThan(0)
    for (const cta of authedCtas) expect(cta).toHaveAttribute('href', '/qrs')
  })

  test('should not show Login or Register links when authenticated', async () => {
    const { view } = await visitRoute('/')
    const userStore = useUserStore()
    userStore.access_token = generateAccessToken()

    await view.rerender({})

    expect(view.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
    expect(view.queryByRole('link', { name: 'Register' })).not.toBeInTheDocument()
  })
})

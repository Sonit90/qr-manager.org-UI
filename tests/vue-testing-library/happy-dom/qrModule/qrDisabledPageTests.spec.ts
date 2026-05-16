import { visitRoute } from '../../helpers/visitRoute.ts'
import { faker } from '@faker-js/faker'

describe('QrDisabledPage Integration Tests', () => {
  test('should render disabled title and message', async () => {
    const { view } = await visitRoute('/qr-disabled')

    view.getByText('QR Code Disabled')
    view.getByText('This QR code has been disabled by the owner.')
  })

  test('should display qr_id from query param', async () => {
    const qrId = faker.string.uuid()

    const { view } = await visitRoute(`/qr-disabled?qr_id=${qrId}`)

    view.getByText(`QR ID: ${qrId}`)
  })

  test('should not render QR ID caption when qr_id is missing', async () => {
    const { view } = await visitRoute('/qr-disabled')

    expect(view.queryByText(/QR ID:/)).not.toBeInTheDocument()
  })

  test('should render warning icon', async () => {
    const { view } = await visitRoute('/qr-disabled')

    expect(view.container.querySelector('.mdi-link-off'))
  })
})

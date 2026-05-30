import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { faker } from '@faker-js/faker'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import {
  mockListQrs,
  mockGetQr,
  mockGetScanLogs,
  mockToggleEnabled,
} from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'

mockUser()

describe('QR Toggle Enabled Integration Tests', () => {
  test('should toggle enabled to false from list when switch is clicked', async () => {
    const qr = generateQr({ enabled: true, name: 'My QR' })
    mockListQrs([qr])
    const { mockedToggle } = mockToggleEnabled({
      id: qr.id,
      enabled: false,
      updated_at: faker.date.recent().toISOString(),
    })

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByLabelText('Toggle My QR'))

    await waitFor(() => {
      expect(mockedToggle).toHaveBeenCalledWith(qr.id, { enabled: false })
    })
  })

  test('should toggle enabled to true from list when disabled QR switch is clicked', async () => {
    const qr = generateQr({ enabled: false, name: 'Off QR' })
    mockListQrs([qr])
    const { mockedToggle } = mockToggleEnabled({
      id: qr.id,
      enabled: true,
      updated_at: faker.date.recent().toISOString(),
    })

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByLabelText('Toggle Off QR'))

    await waitFor(() => {
      expect(mockedToggle).toHaveBeenCalledWith(qr.id, { enabled: true })
    })
  })

  test('should reflect new enabled state in list row badge after toggle', async () => {
    const qr = generateQr({ enabled: true, name: 'Live QR' })
    mockListQrs([qr])
    mockToggleEnabled({
      id: qr.id,
      enabled: false,
      updated_at: faker.date.recent().toISOString(),
    })

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    expect(view.getByText('Active', { selector: '.app-badge' }))

    await user.click(view.getByLabelText('Toggle Live QR'))

    await waitFor(() => {
      expect(view.getByText('Disabled', { selector: '.app-badge' }))
    })
  })

  test('should toggle enabled from detail page', async () => {
    const qr = generateQr({ enabled: true })
    mockGetQr(qr)
    mockGetScanLogs()
    const { mockedToggle } = mockToggleEnabled({
      id: qr.id,
      enabled: false,
      updated_at: faker.date.recent().toISOString(),
    })

    const { view, user } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    await user.click(view.getByLabelText('Enabled'))

    await waitFor(() => {
      expect(mockedToggle).toHaveBeenCalledWith(qr.id, { enabled: false })
    })
  })
})

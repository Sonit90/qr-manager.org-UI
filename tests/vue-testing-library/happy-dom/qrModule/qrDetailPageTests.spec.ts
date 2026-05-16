import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { faker } from '@faker-js/faker'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import {
  mockGetQr,
  mockGetScanLogs,
  mockUpdateTarget,
} from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr, generateScanStats } from '@tests/__apiMocks__/qr/generateQr.ts'

mockUser()

function setupClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
    writable: true,
  })
  return { writeText }
}

describe('QrDetailPage Integration Tests', () => {
  test('should render QR detail with code, target URL, and image', async () => {
    const qr = generateQr({
      code: 'DETAIL01',
      target_url: 'https://example.com/landing',
      image_url: 'https://cdn.example.com/qr.png',
    })
    mockGetQr(qr)
    mockGetScanLogs()

    const { view } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    view.getByText('DETAIL01')
    view.getByText('https://example.com/landing')
    expect(view.getByAltText('QR')).toHaveAttribute('src', 'https://cdn.example.com/qr.png')
  })

  test('should call getQr with current id on mount', async () => {
    const qr = generateQr()
    const { mockedGet } = mockGetQr(qr)
    mockGetScanLogs()

    await visitRoute(`/qrs/${qr.id}`)

    await waitFor(() => {
      expect(mockedGet).toHaveBeenCalledWith(qr.id)
    })
  })

  test('should enter edit mode when pencil is clicked', async () => {
    const qr = generateQr({ target_url: 'https://old.example.com' })
    mockGetQr(qr)
    mockGetScanLogs()

    const { view, user } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    await user.click(view.getByTestId('qr-detail-edit'))

    await waitFor(() => {
      view.getByRole('button', { name: 'Save' })
      view.getByRole('button', { name: 'Cancel' })
    })
  })

  test('should call updateTargetUrl when Save is clicked', async () => {
    const qr = generateQr({ target_url: 'https://old.example.com' })
    mockGetQr(qr)
    mockGetScanLogs()
    const { mockedUpdate } = mockUpdateTarget({
      id: qr.id,
      url: 'https://new.example.com',
      created_at: faker.date.recent().toISOString(),
    })

    const { view, user } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    await user.click(view.getByTestId('qr-detail-edit'))

    await waitFor(() => view.getByRole('button', { name: 'Save' }))

    const input = view.getByDisplayValue('https://old.example.com')
    await user.clear(input)
    await user.type(input, 'https://new.example.com')

    await user.click(view.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(mockedUpdate).toHaveBeenCalledWith(qr.id, { url: 'https://new.example.com' })
    })
  })

  test('should exit edit mode and restore original URL on Cancel', async () => {
    const qr = generateQr({ target_url: 'https://original.example.com' })
    mockGetQr(qr)
    mockGetScanLogs()
    const { mockedUpdate } = mockUpdateTarget()

    const { view, user } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    await user.click(view.getByTestId('qr-detail-edit'))

    await waitFor(() => view.getByRole('button', { name: 'Cancel' }))

    const input = view.getByDisplayValue('https://original.example.com')
    await user.clear(input)
    await user.type(input, 'https://changed.example.com')

    await user.click(view.getByRole('button', { name: 'Cancel' }))

    await waitFor(() => {
      expect(view.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument()
    })
    expect(mockedUpdate).not.toHaveBeenCalled()
    view.getByText('https://original.example.com')
  })

  test('should copy short link from detail page and show notification', async () => {
    const qr = generateQr({ code: 'COPYDETAIL' })
    mockGetQr(qr)
    mockGetScanLogs()
    setupClipboard()

    const { view, user } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    await user.click(view.getByTestId('qr-detail-copy'))

    await waitFor(() => {
      view.getByText('Copied')
    })
  })

  test('should show qrcode icon fallback when image_url is null', async () => {
    const qr = generateQr({ image_url: null })
    mockGetQr(qr)
    mockGetScanLogs()

    const { view } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    expect(view.queryByAltText('QR')).not.toBeInTheDocument()
  })

  test('should render scan statistics from API', async () => {
    const qr = generateQr()
    mockGetQr(qr)
    mockGetScanLogs(
      generateScanStats({
        total_scans: 42,
        device_breakdown: { desktop: 30, mobile: 12 },
        browser_breakdown: { Chrome: 25, Firefox: 17 },
        recent_logs: [],
      }),
    )

    const { view } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    view.getByText('42')
    view.getByText('Device breakdown')
    view.getByText('Browser breakdown')
  })

  test('should hide Recent scans section when there are no logs', async () => {
    const qr = generateQr()
    mockGetQr(qr)
    mockGetScanLogs(generateScanStats({ recent_logs: [] }))

    const { view } = await visitRoute(`/qrs/${qr.id}`)

    await flushPromises()

    expect(view.queryByText('Recent scans')).not.toBeInTheDocument()
  })
})

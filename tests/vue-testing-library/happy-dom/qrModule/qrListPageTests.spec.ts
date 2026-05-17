import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor, within } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { ApiClientQr } from '@/api/qr/ApiClientQr.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { mockListQrs, mockGetQr, mockGetScanLogs } from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'
import { mockWithDelay } from '@tests/helpers/mockWithDelay.ts'
import type { TypeQrQrCodeResponse } from '@/api/__generated__/qr/data-contracts.ts'

mockUser()

describe('QrListPage Integration Tests', () => {
  test('should render page title and table headers', async () => {
    mockListQrs([])

    const { view } = await visitRoute('/qrs')

    view.getByRole('heading', { name: 'My QRs' })
    view.getByText('Preview')
    view.getByText('Name')
    view.getByText('Target URL')
    view.getByText('Scans')
    view.getByText('Enabled')
    view.getByText('Created')
    view.getByText('Actions')
  })

  test('should call listUserQrs on page load', async () => {
    const { mockedList } = mockListQrs([])

    await visitRoute('/qrs')

    await waitFor(() => {
      expect(mockedList).toHaveBeenCalled()
    })
  })

  test('should display QRs returned from API', async () => {
    const qrs = [
      generateQr({ name: 'Marketing QR', target_url: 'https://example.com/m' }),
      generateQr({ name: 'Sales QR', target_url: 'https://example.com/s' }),
    ]
    mockListQrs(qrs)

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    view.getByText('Marketing QR')
    view.getByText('Sales QR')
  })

  test('should fall back to code when name is null', async () => {
    const qrs = [generateQr({ name: null, code: 'ABC123' })]
    mockListQrs(qrs)

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    view.getByText('ABC123')
  })

  test('should render QR preview image when image_url is present', async () => {
    const imageUrl = 'https://cdn.example.com/qr.png'
    mockListQrs([generateQr({ image_url: imageUrl })])

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    expect(view.getByAltText('QR preview')).toHaveAttribute('src', imageUrl)
  })

  test('should refetch list when refresh is clicked', async () => {
    const { mockedList } = mockListQrs([])

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()
    mockedList.mockClear()

    await user.click(view.getByTestId('qr-refresh'))

    await waitFor(() => {
      expect(mockedList).toHaveBeenCalled()
    })
  })

  test('should show loading state while fetching QRs', async () => {
    const mockedRequest = mockWithDelay<TypeQrQrCodeResponse[]>([], 100)
    vi.spyOn(ApiClientQr, 'listUserQrs').mockImplementation(mockedRequest)

    const { view } = await visitRoute('/qrs')

    view.getByRole('progressbar')

    await waitFor(() => {
      expect(view.queryByRole('progressbar')).not.toBeInTheDocument()
    })
  })

  test('should navigate to detail page when view icon is clicked', async () => {
    const qr = generateQr()
    mockListQrs([qr])
    mockGetQr(qr)
    mockGetScanLogs()

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-view'))

    await waitFor(() => {
      expect(window.location.pathname).toBe(`/qrs/${qr.id}`)
    })
  })

  test('should expose target_url as external link', async () => {
    const qr = generateQr({ target_url: 'https://example.org/page' })
    mockListQrs([qr])

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    const cell = view.getByText('https://example.org/page')
    const link = cell.closest('a')
    expect(link).toHaveAttribute('href', 'https://example.org/page')
    expect(link).toHaveAttribute('target', '_blank')
  })

  test('should isolate within rendered table when querying', async () => {
    const qrs = [generateQr({ name: 'Alpha' }), generateQr({ name: 'Beta' })]
    mockListQrs(qrs)

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    const table = view.getByRole('table')
    within(table).getByText('Alpha')
    within(table).getByText('Beta')
  })
})

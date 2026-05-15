import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor, within } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { faker } from '@faker-js/faker'
import { ApiClientQr } from '@/api/qr/ApiClientQr.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import {
  mockListQrs,
  mockCreateQr,
  mockDeleteQr,
  mockToggleEnabled,
} from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'
import { mockWithDelay } from '@tests/helpers/mockWithDelay.ts'
import type { TypeQrQrCodeResponse } from '@/api/__generated__/qr/data-contracts.ts'

mockUser()

function setupClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
  return { writeText }
}

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
    expect(view.getByRole('link', { name: 'Marketing QR' })).toHaveAttribute(
      'href',
      `/qrs/${qrs[0].id}`,
    )
  })

  test('should fall back to code when name is null', async () => {
    const qrs = [generateQr({ name: null, code: 'ABC123' })]
    mockListQrs(qrs)

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    expect(view.getByRole('link', { name: 'ABC123' })).toHaveAttribute('href', `/qrs/${qrs[0].id}`)
  })

  test('should render QR preview image when image_url is present', async () => {
    const imageUrl = 'https://cdn.example.com/qr.png'
    mockListQrs([generateQr({ image_url: imageUrl })])

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    expect(view.getByAltText('QR preview')).toHaveAttribute('src', imageUrl)
  })

  test('should open create dialog when clicking New QR', async () => {
    mockListQrs([])

    const { view, user } = await visitRoute('/qrs')

    await user.click(view.getByRole('button', { name: /new qr/i }))

    await waitFor(() => {
      view.getByLabelText('Name (optional)')
      view.getByLabelText('Target URL')
    })
  })

  test('should submit create form with name and target_url', async () => {
    mockListQrs([])
    const newQr = generateQr({ name: 'My QR', target_url: 'https://example.com' })
    const { mockedCreate } = mockCreateQr(newQr)

    const { view, user } = await visitRoute('/qrs')

    await user.click(view.getByRole('button', { name: /new qr/i }))

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Name (optional)'), 'My QR')
    await user.type(view.getByLabelText('Target URL'), 'https://example.com')

    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith({
        target_url: 'https://example.com',
        name: 'My QR',
      })
    })
  })

  test('should submit create form with null name when name is empty', async () => {
    mockListQrs([])
    const { mockedCreate } = mockCreateQr()

    const { view, user } = await visitRoute('/qrs')

    await user.click(view.getByRole('button', { name: /new qr/i }))

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Target URL'), 'https://example.com')

    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith({
        target_url: 'https://example.com',
        name: null,
      })
    })
  })

  test('should show validation error for invalid URL', async () => {
    mockListQrs([])
    const { mockedCreate } = mockCreateQr()

    const { view, user } = await visitRoute('/qrs')

    await user.click(view.getByRole('button', { name: /new qr/i }))

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Target URL'), 'not-a-url')
    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      view.getByText('Must be a valid URL')
    })
    expect(mockedCreate).not.toHaveBeenCalled()
  })

  test('should toggle enabled state via switch', async () => {
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

  test('should delete QR after confirm', async () => {
    const qr = generateQr()
    mockListQrs([qr])
    const { mockedDelete } = mockDeleteQr()
    vi.spyOn(window, 'confirm').mockReturnValue(true)

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-delete'))

    await waitFor(() => {
      expect(mockedDelete).toHaveBeenCalledWith(qr.id)
    })
  })

  test('should not delete QR when confirm is rejected', async () => {
    const qr = generateQr()
    mockListQrs([qr])
    const { mockedDelete } = mockDeleteQr()
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-delete'))

    await flushPromises()

    expect(mockedDelete).not.toHaveBeenCalled()
  })

  test('should copy short link and show notification', async () => {
    const qr = generateQr({ code: 'TESTCODE' })
    mockListQrs([qr])
    setupClipboard()

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByTestId('qr-copy-link'))

    await waitFor(() => {
      view.getByText('Copied')
    })
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

  test('should optimistically add created QR to the list', async () => {
    mockListQrs([])
    const createdQr = generateQr({ name: 'New Marketing QR' })
    mockCreateQr(createdQr)

    const { view, user } = await visitRoute('/qrs')

    await flushPromises()

    await user.click(view.getByRole('button', { name: /new qr/i }))
    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Target URL'), createdQr.target_url)
    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      view.getByText('New Marketing QR')
    })
  })

  test('should render delete button as icon-only with data-testid per row', async () => {
    const qrs = [generateQr(), generateQr()]
    mockListQrs(qrs)

    const { view } = await visitRoute('/qrs')

    await flushPromises()

    const deleteButtons = view.getAllByTestId('qr-delete')
    expect(deleteButtons).toHaveLength(qrs.length)
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

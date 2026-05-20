import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { faker } from '@faker-js/faker'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { mockListQrs } from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'
import { visitRoute } from '../../helpers/visitRoute.ts'
import { mockExportQr, openExportModalFromDetailPage } from './helpers/qrExportHelpers.ts'

mockUser()

describe('QR Export API Calls', () => {
  beforeEach(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      value: vi.fn().mockReturnValue('blob:mock-url'),
      writable: true,
      configurable: true,
    })
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: vi.fn(),
      writable: true,
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('export API calls', () => {
    test('calls exportQr with format=svg and no dimensions by default', async () => {
      const { mockedExport } = mockExportQr()
      const { view, user, qr } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'svg', width: null, height: null },
        { format: 'blob' },
      )
    })

    test('calls exportQr with format=png and 512x512 for Web preset', async () => {
      const { mockedExport } = mockExportQr()
      const { view, user, qr } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /\bweb\b/i }))
      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'png', width: 512, height: 512 },
        { format: 'blob' },
      )
    })

    test('calls exportQr with format=png and 2000x2000 for Print preset', async () => {
      const { mockedExport } = mockExportQr()
      const { view, user, qr } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /print/i }))
      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'png', width: 2000, height: 2000 },
        { format: 'blob' },
      )
    })

    test('calls exportQr with format=png and 4000x4000 for Poster preset', async () => {
      const { mockedExport } = mockExportQr()
      const { view, user, qr } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /poster/i }))
      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'png', width: 4000, height: 4000 },
        { format: 'blob' },
      )
    })

    test('calls exportQr with format=svg for T-Shirt after switching from another preset', async () => {
      const { mockedExport } = mockExportQr()
      const { view, user, qr } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /\bweb\b/i }))
      await user.click(view.getByRole('button', { name: /t-shirt/i }))
      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'svg', width: null, height: null },
        { format: 'blob' },
      )
    })

    test('calls exportQr with custom dimensions when manually entered', async () => {
      const { mockedExport } = mockExportQr()
      const width = faker.number.int({ min: 150, max: 5000 })
      const height = faker.number.int({ min: 150, max: 5000 })
      const { view, user, qr } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))
      await user.type(view.getByLabelText('Width (px)'), String(width))
      await user.type(view.getByLabelText('Height (px)'), String(height))
      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'png', width, height },
        { format: 'blob' },
      )
    })

    test('calls exportQr with null dimensions when left blank', async () => {
      const { mockedExport } = mockExportQr()
      const { view, user, qr } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))
      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'png', width: null, height: null },
        { format: 'blob' },
      )
    })
  })

  describe('from list page', () => {
    test('opens export modal when export button clicked', async () => {
      const qr = generateQr()
      mockListQrs([qr])
      mockExportQr()

      const { view, user } = await visitRoute('/qrs')
      await flushPromises()

      await user.click(view.getByTestId('qr-export'))

      await waitFor(() => view.getByRole('button', { name: /download/i }))
    })

    test('calls exportQr with correct qr id from list page', async () => {
      const qr = generateQr()
      mockListQrs([qr])
      const { mockedExport } = mockExportQr()

      const { view, user } = await visitRoute('/qrs')
      await flushPromises()

      await user.click(view.getByTestId('qr-export'))
      await waitFor(() => view.getByRole('button', { name: /download/i }))
      await user.click(view.getByRole('button', { name: /download/i }))
      await flushPromises()

      expect(mockedExport).toHaveBeenCalledWith(
        { id: qr.id, format: 'svg', width: null, height: null },
        { format: 'blob' },
      )
    })
  })
})

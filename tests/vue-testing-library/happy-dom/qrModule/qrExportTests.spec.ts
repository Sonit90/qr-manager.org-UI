import { waitFor } from '@testing-library/vue'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { mockExportQr, openExportModalFromDetailPage } from './helpers/qrExportHelpers.ts'

mockUser()

describe('QR Export Modal Integration Tests', () => {
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

  describe('default state', () => {
    test('T-Shirt preset is active on open', async () => {
      mockExportQr()
      const { view } = await openExportModalFromDetailPage()

      expect(view.getByRole('button', { name: /t-shirt/i }).className).toContain(
        'preset-btn-active',
      )
    })

    test('SVG is active format on open', async () => {
      mockExportQr()
      const { view } = await openExportModalFromDetailPage()

      expect(view.getByRole('button', { name: 'SVG' }).className).toContain('format-tab-active')
    })

    test('SVG vector note shown instead of dimension inputs on open', async () => {
      mockExportQr()
      const { view } = await openExportModalFromDetailPage()

      view.getByText(/svg is vector/i)
      expect(view.queryByLabelText('Width (px)')).not.toBeInTheDocument()
      expect(view.queryByLabelText('Height (px)')).not.toBeInTheDocument()
    })
  })

  describe('preset selection', () => {
    test('Web preset sets PNG format and 512x512 dimensions', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /\bweb\b/i }))

      expect(view.getByRole('button', { name: /\bweb\b/i }).className).toContain(
        'preset-btn-active',
      )
      expect(view.getByRole('button', { name: 'PNG' }).className).toContain('format-tab-active')
      expect((view.getByLabelText('Width (px)') as HTMLInputElement).value).toBe('512')
      expect((view.getByLabelText('Height (px)') as HTMLInputElement).value).toBe('512')
    })

    test('Print preset sets PNG format and 2000x2000 dimensions', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /print/i }))

      expect(view.getByRole('button', { name: 'PNG' }).className).toContain('format-tab-active')
      expect((view.getByLabelText('Width (px)') as HTMLInputElement).value).toBe('2000')
      expect((view.getByLabelText('Height (px)') as HTMLInputElement).value).toBe('2000')
    })

    test('Poster preset sets PNG format and 4000x4000 dimensions', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /poster/i }))

      expect((view.getByLabelText('Width (px)') as HTMLInputElement).value).toBe('4000')
      expect((view.getByLabelText('Height (px)') as HTMLInputElement).value).toBe('4000')
    })

    test('switching back to T-Shirt from Web sets SVG and hides dimensions', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /\bweb\b/i }))
      await user.click(view.getByRole('button', { name: /t-shirt/i }))

      expect(view.getByRole('button', { name: 'SVG' }).className).toContain('format-tab-active')
      expect(view.queryByLabelText('Width (px)')).not.toBeInTheDocument()
    })

    test('selecting a different preset clears the previous one', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /\bweb\b/i }))
      await user.click(view.getByRole('button', { name: /print/i }))

      expect(view.getByRole('button', { name: /\bweb\b/i }).className).not.toContain(
        'preset-btn-active',
      )
      expect(view.getByRole('button', { name: /print/i }).className).toContain('preset-btn-active')
    })
  })

  describe('format tab switching', () => {
    test('switching to SVG after a PNG preset activates T-Shirt', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /print/i }))
      await user.click(view.getByRole('button', { name: 'SVG' }))

      expect(view.getByRole('button', { name: /t-shirt/i }).className).toContain(
        'preset-btn-active',
      )
    })

    test('switching format tab clears active preset', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))

      expect(view.getByRole('button', { name: /t-shirt/i }).className).not.toContain(
        'preset-btn-active',
      )
    })

    test('switching to PNG shows dimension inputs', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))

      view.getByLabelText('Width (px)')
      view.getByLabelText('Height (px)')
    })

    test('switching back to SVG hides dimension inputs', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))
      await user.click(view.getByRole('button', { name: 'SVG' }))

      expect(view.queryByLabelText('Width (px)')).not.toBeInTheDocument()
    })
  })

  describe('dimension validation', () => {
    test('shows error when width is below 150', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))
      await user.type(view.getByLabelText('Width (px)'), '50')

      view.getByText(/width must be 150/i)
    })

    test('shows error when width exceeds 5000', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))
      await user.type(view.getByLabelText('Width (px)'), '9999')

      view.getByText(/width must be 150/i)
    })

    test('shows error when height is below 150', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))
      await user.type(view.getByLabelText('Height (px)'), '10')

      view.getByText(/height must be 150/i)
    })

    test('download button is disabled when validation error present', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: 'PNG' }))
      await user.type(view.getByLabelText('Width (px)'), '50')

      expect(view.getByRole('button', { name: /download/i })).toBeDisabled()
    })
  })

  describe('dialog actions', () => {
    test('cancel button closes modal', async () => {
      mockExportQr()
      const { view, user } = await openExportModalFromDetailPage()

      await user.click(view.getByRole('button', { name: /cancel/i }))

      await waitFor(() => {
        expect(view.queryByRole('button', { name: /download/i })).not.toBeInTheDocument()
      })
    })
  })
})

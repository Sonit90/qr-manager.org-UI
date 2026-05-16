import { visitRoute } from '../../helpers/visitRoute.ts'
import { waitFor } from '@testing-library/vue'
import { flushPromises } from '@vue/test-utils'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'
import { mockListQrs, mockCreateQr } from '@tests/__apiMocks__/qr/mockQr.ts'
import { generateQr } from '@tests/__apiMocks__/qr/generateQr.ts'

mockUser()

describe('QR Creation Integration Tests', () => {
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

  test('should trim whitespace from name before submit', async () => {
    mockListQrs([])
    const { mockedCreate } = mockCreateQr()

    const { view, user } = await visitRoute('/qrs')

    await user.click(view.getByRole('button', { name: /new qr/i }))

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Name (optional)'), '  Padded Name  ')
    await user.type(view.getByLabelText('Target URL'), 'https://example.com')

    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledWith({
        target_url: 'https://example.com',
        name: 'Padded Name',
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

  test('should not submit when target URL is empty', async () => {
    mockListQrs([])
    const { mockedCreate } = mockCreateQr()

    const { view, user } = await visitRoute('/qrs')

    await user.click(view.getByRole('button', { name: /new qr/i }))

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.click(view.getByRole('button', { name: 'Create' }))

    await flushPromises()

    expect(mockedCreate).not.toHaveBeenCalled()
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
})

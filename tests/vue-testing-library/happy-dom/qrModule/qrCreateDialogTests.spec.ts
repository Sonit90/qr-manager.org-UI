import { render } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { waitFor } from '@testing-library/vue'
import { createVuetify } from 'vuetify'
import QrCreateDialog from '@/modules/qr/QrCreateDialog.vue'

function mountDialog(open = true, loading = false) {
  const user = userEvent.setup()
  const vuetify = createVuetify()
  const view = render(QrCreateDialog, {
    props: { open, loading },
    global: { plugins: [vuetify] },
  })
  return { view, user }
}

describe('QrCreateDialog Component Tests', () => {
  test('should render Name and Target URL inputs when open', async () => {
    const { view } = mountDialog(true)

    await waitFor(() => {
      view.getByLabelText('Name (optional)')
      view.getByLabelText('Target URL')
    })
  })

  test('should not render form fields when open is false', () => {
    const { view } = mountDialog(false)

    expect(view.queryByLabelText('Target URL')).not.toBeInTheDocument()
    expect(view.queryByLabelText('Name (optional)')).not.toBeInTheDocument()
  })

  test('should emit submit with target_url and name', async () => {
    const { view, user } = mountDialog(true)

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Name (optional)'), 'Campaign A')
    await user.type(view.getByLabelText('Target URL'), 'https://example.com')

    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(view.emitted('submit')).toBeTruthy()
    })
    expect(view.emitted('submit')?.[0]).toEqual([
      { target_url: 'https://example.com', name: 'Campaign A' },
    ])
  })

  test('should emit submit with null name when name input is empty', async () => {
    const { view, user } = mountDialog(true)

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Target URL'), 'https://example.com')

    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      expect(view.emitted('submit')).toBeTruthy()
    })
    expect(view.emitted('submit')?.[0]).toEqual([{ target_url: 'https://example.com', name: null }])
  })

  test('should emit update:open false when Cancel is clicked', async () => {
    const { view, user } = mountDialog(true)

    await waitFor(() => view.getByRole('button', { name: 'Cancel' }))

    await user.click(view.getByRole('button', { name: 'Cancel' }))

    expect(view.emitted('update:open')?.at(-1)).toEqual([false])
  })

  test('should not emit submit for invalid URL', async () => {
    const { view, user } = mountDialog(true)

    await waitFor(() => view.getByLabelText('Target URL'))

    await user.type(view.getByLabelText('Target URL'), 'not-a-url')
    await user.click(view.getByRole('button', { name: 'Create' }))

    await waitFor(() => {
      view.getByText('Must be a valid URL')
    })
    expect(view.emitted('submit')).toBeFalsy()
  })

  test('should disable Cancel button while loading', async () => {
    const { view } = mountDialog(true, true)

    await waitFor(() => view.getByRole('button', { name: 'Cancel' }))

    expect(view.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })
})

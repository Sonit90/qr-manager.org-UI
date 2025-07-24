import { visitRoute } from '@tests/vue-testing-library/helpers/visitRoute.ts'

export async function renderFileUpload() {
  const { view, user } = await visitRoute('/my-files')

  const container = view.getByTestId('user-files-page')
  const uploadButton = view.getByRole('button', { name: /upload file/i })

  return { view, user, container, uploadButton }
}

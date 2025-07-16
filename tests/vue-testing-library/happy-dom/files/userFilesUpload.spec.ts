import { within } from '@testing-library/vue'
import { mockFileReadFiles } from '@tests/__apiMocks__/files/mockFileReadFiles.ts'
import { generateFileData } from '@tests/__apiMocks__/files/generateApiFiles.ts'
import { renderFileUpload } from '@tests/vue-testing-library/happy-dom/files/_renderFileUpload.ts'

// Mock the API client
vi.mock('@/api/v1/ApiClientV1.ts', () => ({
  ApiClientV1: {
    filesReadFiles: vi.fn(),
    filesGetUploadUrl: vi.fn(),
  },
}))

// Mock the FileUploadService
vi.mock('@/api/services/FileUploadService.ts', () => ({
  FileUploadService: {
    uploadToMinIO: vi.fn(),
  },
}))

const testFiles = generateFileData()
mockFileReadFiles(testFiles)

describe('UserFilesPage - File Upload Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should open upload dialog when upload button is clicked', async () => {
    const { view, user, container, uploadButton } = await renderFileUpload()

    within(container).getByText('My Files')

    await user.click(uploadButton)

    view.getByText('Drag and drop files here')
  })

  test('should close upload dialog when cancel button is clicked', async () => {
    const { view, user, uploadButton } = await renderFileUpload()

    // Open dialog
    await user.click(uploadButton)

    // Click cancel button
    const cancelButton = view.getByRole('button', { name: /cancel/i })
    await user.click(cancelButton)

    expect(view.getByText('Drag and drop files here')).not.toBeVisible()
  })

  test('should accept only allowed file types', async () => {
    const { view, user, uploadButton } = await renderFileUpload()

    // Open dialog
    await user.click(uploadButton)

    const fileInputContainer = view.getByTestId('file-upload')
    const fileInput = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toHaveAttribute('accept', '.csv,.xls,.xlsx')
  })
})

import { waitFor } from '@testing-library/vue'
import { mockFileReadFiles } from '@tests/__apiMocks__/files/mockFileReadFiles.ts'
import {
  mockFileGetUploadUrl,
  mockFileUploadFlow,
  mockFileUploadToMinIO,
} from '@tests/__apiMocks__/files/mockFileUpload.ts'
import {
  createMockFile,
  generateFileData,
  generateFileNameWithExtension,
} from '@tests/__apiMocks__/files/generateApiFiles.ts'
import { faker } from '@faker-js/faker'
import { renderFileUpload } from '@tests/vue-testing-library/happy-dom/files/_renderFileUpload.ts'
import { mockWithDelay } from '@tests/helpers/mockWithDelay.ts'

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

const fileName = generateFileNameWithExtension()
const testFiles = generateFileData()
const mockFile = createMockFile(
  fileName,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
)

mockFileReadFiles(testFiles)

describe('UserFilesPage - File Upload Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should enable upload button when file is selected', async () => {
    const fileName = generateFileNameWithExtension()

    const { view, user, uploadButton } = await renderFileUpload()

    // Open dialog
    await user.click(uploadButton)

    // Initially upload button should be disabled
    const dialogUploadButton = view.getByRole('button', { name: /^upload$/i })
    expect(dialogUploadButton).toBeDisabled()

    // Select a file
    const fileInputContainer = view.getByTestId('file-upload')
    const fileInput = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement
    const mockFile = createMockFile(
      fileName,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )

    await user.upload(fileInput, mockFile)

    // Upload button should now be enabled
    await waitFor(() => {
      expect(dialogUploadButton).not.toBeDisabled()
    })
  })

  test('should successfully upload a file and refresh file list', async () => {
    const initialFiles = generateFileData()
    const updatedFiles = [
      ...initialFiles,
      {
        id: faker.number.int({ min: 100, max: 999 }),
        name: fileName,
        original_name: fileName,
        status: 'ready' as const,
        created_at: faker.date.recent().toISOString(),
        owner_id: faker.string.uuid(),
        is_active: true,
      },
    ]

    // Mock initial file list
    const { mockedFileReadFile } = mockFileReadFiles(initialFiles)

    // Mock upload flow
    const { mockedGetUploadUrl, mockedUploadToMinIO, uploadUrl } = mockFileUploadFlow({
      uploadSuccess: true,
      getUploadUrlSuccess: true,
    })

    // Mock updated file list after upload
    mockedFileReadFile.mockResolvedValueOnce(initialFiles).mockResolvedValueOnce(updatedFiles)

    const { view, user, uploadButton } = await renderFileUpload()

    // Open dialog
    await user.click(uploadButton)

    const fileInputContainer = view.getByTestId('file-upload')
    const fileInput = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(fileInput, mockFile)

    // Click upload button
    const dialogUploadButton = view.getByRole('button', { name: /^upload$/i })
    await user.click(dialogUploadButton)

    // Verify API calls
    expect(mockedGetUploadUrl).toHaveBeenCalledWith({
      original_filename: fileName,
    })

    expect(mockedUploadToMinIO).toHaveBeenCalledWith(mockFile, uploadUrl)

    // Verify file list is refreshed
    expect(mockedFileReadFile).toHaveBeenCalledTimes(2)
  })

  test('should handle upload URL API error', async () => {
    // Mock upload URL API error
    const errorMessage = faker.lorem.sentence()
    const { mockedGetUploadUrl, mockedUploadToMinIO } = mockFileUploadFlow({
      getUploadUrlSuccess: false,
      getUploadUrlError: errorMessage,
    })

    const { view, user, uploadButton } = await renderFileUpload()

    // Open dialog and select file
    await user.click(uploadButton)

    const fileInputContainer = view.getByTestId('file-upload')
    const fileInput = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement
    const mockFile = createMockFile(
      fileName,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )

    await user.upload(fileInput, mockFile)

    // Click upload button
    const dialogUploadButton = view.getByRole('button', { name: /^upload$/i })
    await user.click(dialogUploadButton)

    // Verify API was called
    await waitFor(() => {
      expect(mockedGetUploadUrl).toHaveBeenCalledWith({
        original_filename: fileName,
      })
    })

    // FileUploadService should not be called
    expect(mockedUploadToMinIO).not.toHaveBeenCalled()
  })

  test('should handle MinIO upload failure', async () => {
    // Mock MinIO upload failure
    const { mockedGetUploadUrl, mockedUploadToMinIO, uploadUrl } = mockFileUploadFlow({
      getUploadUrlSuccess: true,
      uploadSuccess: false,
    })

    const { view, user, uploadButton } = await renderFileUpload()

    // Open dialog and select file
    await user.click(uploadButton)

    const fileInputContainer = view.getByTestId('file-upload')
    const fileInput = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, mockFile)

    // Click upload button
    const dialogUploadButton = view.getByRole('button', { name: /^upload$/i })
    await user.click(dialogUploadButton)

    // Verify both API calls were made
    await waitFor(() => {
      expect(mockedGetUploadUrl).toHaveBeenCalledWith({
        original_filename: fileName,
      })
    })

    expect(mockedUploadToMinIO).toHaveBeenCalledWith(mockFile, uploadUrl)

    await waitFor(() => {
      expect(view.getByTestId('file-upload-body')).toBeVisible()
    })
  })

  test('should show uploading state during file upload', async () => {
    // Mock upload URL response
    mockFileGetUploadUrl()

    // Mock MinIO upload with delay
    // let resolveUpload: (value: boolean) => void
    // const uploadPromise = new Promise<boolean>((resolve) => {
    //   resolveUpload = resolve
    // })
    const { mockedUploadToMinIO } = mockFileUploadToMinIO()
    mockedUploadToMinIO.mockReturnValue(mockWithDelay({}, 1000))

    const { view, user, uploadButton } = await renderFileUpload()

    // Open dialog and select file
    await user.click(uploadButton)

    const fileInputContainer = view.getByTestId('file-upload')
    const fileInput = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement

    await user.upload(fileInput, mockFile)

    // Click upload button
    const dialogUploadButton = view.getByRole('button', { name: /^upload$/i })
    await user.click(dialogUploadButton)

    // Check for loading state
    await waitFor(() => {
      expect(dialogUploadButton).toBeDisabled()
    })

    // Wait for upload to complete
    await waitFor(() => {
      expect(view.getByTestId('file-upload-body')).not.toBeVisible()
    })
  })

  test('should handle file selection and deselection', async () => {
    const { view, user, uploadButton } = await renderFileUpload()

    await user.click(uploadButton)

    const dialogUploadButton = view.getByRole('button', { name: /^upload$/i })
    const fileInputContainer = view.getByTestId('file-upload')
    const fileInput = fileInputContainer.querySelector('input[type="file"]') as HTMLInputElement

    // Initially upload button should be disabled
    expect(dialogUploadButton).toBeDisabled()

    await user.upload(fileInput, mockFile)

    // Upload button should be enabled
    await waitFor(() => {
      expect(dialogUploadButton).not.toBeDisabled()
    })

    // Clear file selection
    await user.upload(fileInput, [])

    // Upload button should be disabled again
    await waitFor(() => {
      expect(dialogUploadButton).toBeDisabled()
    })
  })
})

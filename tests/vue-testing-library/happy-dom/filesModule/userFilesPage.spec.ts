import { waitFor } from '@testing-library/vue'
import { visitRoute } from '../../helpers/visitRoute.ts'
import userEvent from '@testing-library/user-event'
import { ApiClientV1 } from '@/api/v1/ApiClientV1.ts'
import { mockWithDelay } from '../../../helpers/mockWithDelay.ts'
import {
  mockFileReadFiles,
  mockFileReadFilesError,
} from '@tests/__apiMocks__/files/mockFileReadFiles.ts'
import {
  buildTypeFileV1Array,
  buildDownloadUrlResponse,
} from '@tests/__apiMocks__/files/generateApiFiles.ts'
import { mockUser } from '@tests/__apiMocks__/user/mockUser.ts'

const testFiles = buildTypeFileV1Array(2, [
  { id: '1', status: 'processed' },
  { id: '2', status: 'pending' },
])

mockUser()

describe('UserFilesPage', () => {
  test('should display files when API returns data', async () => {
    // Mock the API response
    const { mockedFileReadFile } = mockFileReadFiles(testFiles)

    const { view } = await visitRoute('/my-files')

    // Wait for the API call to be made
    await waitFor(() => {
      expect(mockedFileReadFile).toHaveBeenCalled()
    })

    // Check if files are displayed
    await waitFor(() => {
      view.getByText(testFiles[0].name)
      view.getByText(testFiles[1].name)
    })
  })

  test('should display loading state initially', async () => {
    // Mock the API response with a delay
    const mockedFilesReadFiles = mockWithDelay(testFiles, 100)
    vi.spyOn(ApiClientV1, 'filesReadFiles').mockImplementation(mockedFilesReadFiles)

    const { view } = await visitRoute('/my-files')

    // Check for loading state - look for the circular progress
    await waitFor(() => {
      const progressElement = view.container.querySelector('.v-progress-circular')
      expect(progressElement).not.toBeNull()
    })

    // Wait for the data to load
    await waitFor(
      () => {
        expect(view.getByText(testFiles[0].name)).toBeInTheDocument()
      },
      { timeout: 1000 },
    )
  })

  test('should display empty state when no files are returned', async () => {
    // Mock the API response with empty array
    mockFileReadFiles([])

    const { view } = await visitRoute('/my-files')

    // Wait for loading to complete and check for empty state message
    await waitFor(() => {
      expect(view.getByText('No files found')).toBeInTheDocument()
    })
  })

  test('should download a file when download button is clicked', async () => {
    // Mock the files API response
    mockFileReadFiles(testFiles)

    // Mock the download URL API response
    const downloadUrl = 'https://example.com/download/file1.xlsx'
    const mockedGetDownloadUrl = vi.fn().mockResolvedValue(buildDownloadUrlResponse(downloadUrl))
    vi.spyOn(ApiClientV1, 'filesGetDownloadUrl').mockImplementation(mockedGetDownloadUrl)

    // Mock window.open
    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    const { view } = await visitRoute('/my-files')

    // Wait for files to be displayed
    await waitFor(() => {
      expect(view.getByText(testFiles[0].name)).toBeInTheDocument()
    })

    // Find and click the download button for the first file
    const downloadButtons = view.getAllByTitle('Download')
    await userEvent.click(downloadButtons[0])

    // Verify the download function was called with the correct file ID
    expect(mockedGetDownloadUrl).toHaveBeenCalledWith(testFiles[0].id)

    // Verify window.open was called with the download URL
    await waitFor(() => {
      expect(windowOpenSpy).toHaveBeenCalledWith(downloadUrl, '_blank')
    })
  })

  test('should show error message when API call fails', async () => {
    // Mock the API response with an error
    mockFileReadFilesError('Network error', 503)

    const { view } = await visitRoute('/my-files')

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(view.getByText('Failed to load files. Please try again later.')).toBeInTheDocument()
    })
  })
})

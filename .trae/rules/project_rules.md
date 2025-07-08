Instructions for integration tests:
Don't use barrel files(files that import and reexport things)

Instead of hardcoding use faker library to generate the data.

Don't mock anything except API calls

Don't call unmount in the end of the test.

Use view object instead of screen to get the data

Don't check values inside pinia store.

Don't access pinia store at all

If API is getting called, check that API is getting called with the parameters
Prefer functions over constants

For Typescript don’t use Any types, instead use actual API response types
Don’t import import { vi } from ‘vitest’ because it’s imported automatically

Don't check that element exists like that:
const warningIcon = view.container.querySelector('.mdi-link-off')
expect(warningIcon).toBeTruthy()
view.container.querySelector('.mdi-link-off') should be enough, because it fails, if element is not found

If you want to check link's url, use similar code:
expect(view.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', 'sign-in')

If you want to mock data, use following approach:
vi.mock('@/api/v1/ApiClientV1.ts', () => ({
ApiClientV1: {
authenticationActivateUser: vi.fn(),
},
}))

vi.mocked(ApiClientV1.authenticationActivateUser).mockImplementation(mockedActivation)
import { faker } from '@faker-js/faker'
import type { TypeTokenV1 } from '@/api/__generated__/v1/data-contracts.ts'

// Generate mock token response using faker
export const generateMockTokenResponse = (): TypeTokenV1 => ({
  access_token: faker.string.alphanumeric(32),
  refresh_token: faker.string.alphanumeric(32),
  token_type: 'Bearer',
})

// Generate login credentials for testing
export const generateValidLoginCredentials = () => ({
  username: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
})

export const generateInvalidLoginCredentials = () => ({
  username: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
})

export const generateInvalidEmailCredentials = () => ({
  username: 'invalid-email',
  password: faker.internet.password({ length: 8 }),
})

export const generateShortPasswordCredentials = () => ({
  username: faker.internet.email(),
  password: '123',
})

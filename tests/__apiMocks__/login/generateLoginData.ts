import { faker } from '@faker-js/faker'
import { type TypeTokenPairV1 } from '@/api/__generated__/v1/data-contracts.ts'

// Generate mock token response using faker
export const generateMockTokenResponse = (): TypeTokenPairV1 => ({
  access_token: faker.string.alphanumeric(32),
  refresh_token: faker.string.alphanumeric(32),
  access_expires_in: faker.number.int({ min: 3600, max: 86400 }),
})

// Generate login credentials for testing
export const generateValidLoginCredentials = () => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
})

export const generateInvalidLoginCredentials = () => ({
  email: faker.internet.email(),
  password: faker.internet.password({ length: 8 }),
})

export const generateInvalidEmailCredentials = () => ({
  email: 'invalid-email',
  password: faker.internet.password({ length: 8 }),
})

export const generateShortPasswordCredentials = () => ({
  email: faker.internet.email(),
  password: '123',
})

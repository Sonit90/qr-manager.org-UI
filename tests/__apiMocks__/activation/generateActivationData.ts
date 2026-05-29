import { faker } from '@faker-js/faker'

export function generateVerificationEmail(): string {
  return faker.internet.email()
}

export function generateValidCode(): string {
  return faker.string.numeric(6)
}

export function generateInvalidCode(): string {
  return faker.string.numeric({ length: { min: 1, max: 5 } })
}

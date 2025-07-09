import { faker } from '@faker-js/faker'
import type { TypeFileV1 } from '@/api/__generated__/v1/data-contracts.ts'

export function buildTypeFileV1(overrides: Partial<TypeFileV1> = {}): TypeFileV1 {
  return {
    id: faker.number.int({ min: 1, max: 1000 }),
    name: faker.system.fileName(),
    original_name: faker.system.fileName(),
    status: faker.helpers.arrayElement(['ready', 'pending', 'processing', 'error']),
    created_at: faker.date.recent().toISOString(),
    owner_id: faker.string.uuid(),
    is_active: true,
    ...overrides,
  }
}

export function buildTypeFileV1Array(count = 2, overrides: Partial<TypeFileV1>[] = []): TypeFileV1[] {
  return Array.from({ length: count }, (_, index) => {
    return buildTypeFileV1(overrides[index] || {})
  })
}

export function buildDownloadUrlResponse(url = faker.internet.url()) {
  return { data: { url } }
}
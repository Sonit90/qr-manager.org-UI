import { faker } from '@faker-js/faker'
import type { TypeFileV1 } from 'src/api/__generated__/v1/data-contracts.ts'

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

export function buildTypeFileV1Array(
  count = 2,
  overrides: Partial<TypeFileV1>[] = [],
): TypeFileV1[] {
  return Array.from({ length: count }, (_, index) => {
    return buildTypeFileV1(overrides[index] || {})
  })
}

export function buildDownloadUrlResponse(download_url = faker.internet.url()) {
  return { download_url }
}

export function generateFileNameWithExtension() {
  const extensions = ['xls', 'xlsx', 'csv']
  const name = faker.word.words(1).replaceAll(/\s/g, '')
  const extension = faker.helpers.arrayElement(extensions)
  return `${name}.${extension}`
}

export function createMockFile(
  name: string,
  type: string,
  size: number = faker.number.int({ min: 1024, max: 10240 }),
): File {
  const content = faker.lorem.paragraphs()
  const blob = new Blob([content], { type })
  const file = new File([blob], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

export function generateFileData(): TypeFileV1[] {
  return buildTypeFileV1Array(faker.number.int({ min: 1, max: 3 }))
}

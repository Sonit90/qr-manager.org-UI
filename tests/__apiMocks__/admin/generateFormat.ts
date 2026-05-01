import { faker } from '@faker-js/faker'
import {
  TypeFileKindV1,
  type TypeOutputFormatV1,
} from '@/api/__generated__/v1/data-contracts.ts'

export function generateFormat(overrides: Partial<TypeOutputFormatV1> = {}): TypeOutputFormatV1 {
  return {
    id: faker.string.uuid(),
    owner_id: faker.string.uuid(),
    filename: faker.system.fileName({ extensionCount: 0 }),
    description: faker.lorem.sentence(),
    output_extension: TypeFileKindV1.EnumXlsx,
    columns: [
      { name: 'SKU', canonical: 'sku', extra: false, col_type: { kind: 'string' } },
      { name: 'Price', canonical: 'price', extra: false, col_type: { kind: 'float' } },
    ],
    steps: [],
    created_at: faker.date.past().toISOString(),
    updated_at: faker.date.recent().toISOString(),
    ...overrides,
  }
}

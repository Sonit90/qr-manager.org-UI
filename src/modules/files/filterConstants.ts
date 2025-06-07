import {
  FilterType,
  type NumberFileFilter,
  type StringFileFilter,
} from '@/modules/files/fileTypes.ts'

export const filterOperators: Record<
  FilterType,
  Array<NumberFileFilter['operator'] | StringFileFilter['operator']>
> = {
  [FilterType.String]: ['contains', 'not contains', 'starts with', 'ends with', '===', '!='],
  [FilterType.Number]: ['>', '<', '>=', '<=', '===', '!='],
}

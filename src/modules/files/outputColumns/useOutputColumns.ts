import { computed, type Ref, ref } from 'vue'
import type { FileColumn } from '@/modules/files/fileTypes.ts'

export interface OutputColumnData {
  name: string
}

export interface OutputColumn extends OutputColumnData {
  index: number
}

const outputColumns = ref<OutputColumnData[]>([])

export function useOutputColumns(fileColumns?: Ref<FileColumn[] | undefined>) {
  const availableColumns = computed<OutputColumn[]>(() => {
    if (!fileColumns) {
      return []
    }
    const currentColumns = fileColumns.value?.map((col) => col.mapInformation?.targetName)
    return outputColumns.value
      .filter((e) => !currentColumns?.includes(e.name))
      .map((col, index) => Object.assign(col, { index }))
  })
  return {
    availableColumns,
    outputColumns,
  }
}

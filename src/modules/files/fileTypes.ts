export type FileFilter = NumberFileFilter | StringFileFilter
export enum FilterType {
  Number = 'number',
  String = 'string',
}

export interface NumberFileFilter {
  type: FilterType.Number
  operator: '>' | '<' | '>=' | '<=' | '===' | '!='
  value: number
  sourceIndex: number
}

export interface StringFileFilter {
  type: FilterType.String
  operator: 'contains' | 'not contains' | 'starts with' | 'ends with' | '===' | '!='
  value: string
  sourceIndex: number
}

type Transformation =
  | { type: 'trim' }
  | { type: 'multiply'; value: number }
  | { type: string; [key: string]: unknown }

interface MapInformation {
  targetIndex: number
  targetName: string
}

export interface FileColumn {
  name: string
  mapInformation: MapInformation | null
  transformations: Transformation[]
}

export interface FileInput {
  id: string
  name: string
  columns: FileColumn[]
  filters: FileFilter[]
}

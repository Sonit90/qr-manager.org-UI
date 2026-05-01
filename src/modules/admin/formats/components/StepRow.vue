<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypeOutputColumnV1,
  TypeOutputStepV1,
  TypeStepScopeV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import ExprEditor from '@/modules/admin/formats/components/ExprEditor.vue'
import {
  type Expr,
  forbiddenOpsForColType,
  makeDefaultExpr,
} from '@/modules/admin/formats/types.ts'

const props = defineProps<{
  modelValue: TypeOutputStepV1
  index: number
  columns: TypeOutputColumnV1[]
}>()

const emit = defineEmits<{
  'update:modelValue': [step: TypeOutputStepV1]
  remove: []
}>()

const stepKind = computed(() => props.modelValue.kind)

const filterScope = computed(() => {
  if (props.modelValue.kind === 'filter') return props.modelValue.scope
  return 'file'
})

const transformField = computed(() => {
  if (props.modelValue.kind === 'transform') return props.modelValue.field
  return ''
})

const fieldNames = computed(() =>
  props.columns.map((c) => c.canonical || c.name).filter((n) => n.length > 0),
)

const transformForbiddenOps = computed(() => {
  if (props.modelValue.kind !== 'transform') return undefined
  const field = props.modelValue.field
  const targetCol = props.columns.find((c) => (c.canonical || c.name) === field)
  return forbiddenOpsForColType(targetCol?.col_type)
})

const exprValue = computed<Expr>(() => props.modelValue.expr as Expr)

function setKind(kind: 'filter' | 'transform') {
  if (kind === 'filter') {
    emit('update:modelValue', {
      kind: 'filter',
      scope: 'file' as TypeStepScopeV1,
      expr: makeDefaultExpr('bool'),
    })
  } else {
    emit('update:modelValue', {
      kind: 'transform',
      field: fieldNames.value[0] ?? '',
      expr: makeDefaultExpr('str'),
    })
  }
}

function setScope(scope: TypeStepScopeV1) {
  if (props.modelValue.kind !== 'filter') return
  emit('update:modelValue', { ...props.modelValue, scope })
}

function setField(field: string) {
  if (props.modelValue.kind !== 'transform') return
  emit('update:modelValue', { ...props.modelValue, field })
}

function setExpr(expr: Expr) {
  emit('update:modelValue', { ...props.modelValue, expr })
}

const kindItems = [
  { title: 'Filter (drop rows)', value: 'filter' },
  { title: 'Transform (set field)', value: 'transform' },
]

const scopeItems = [
  { title: 'Per file (before merge)', value: 'file' },
  { title: 'Global (after merge)', value: 'global' },
]
</script>

<template>
  <v-card variant="outlined" class="step-row pa-3 mb-2">
    <div class="d-flex align-start ga-2">
      <v-icon class="drag-handle mt-3" icon="mdi-drag-vertical" />
      <div class="flex-grow-1">
        <div class="d-flex align-center mb-2">
          <v-chip color="primary" size="small" variant="flat" class="mr-2">
            Step {{ index + 1 }}
          </v-chip>
          <v-spacer />
          <v-btn
            size="small"
            variant="text"
            color="error"
            icon="mdi-delete"
            title="Remove step"
            @click="emit('remove')"
          />
        </div>

        <div class="d-flex ga-3 flex-wrap mb-3">
          <v-select
            :model-value="stepKind"
            :items="kindItems"
            label="Kind"
            variant="outlined"
            density="compact"
            style="min-width: 220px"
            class="flex-grow-0"
            hide-details
            @update:model-value="setKind($event)"
          />
          <v-select
            v-if="stepKind === 'filter'"
            :model-value="filterScope"
            :items="scopeItems"
            label="Scope"
            variant="outlined"
            density="compact"
            style="min-width: 220px"
            class="flex-grow-0"
            hide-details
            @update:model-value="setScope($event as TypeStepScopeV1)"
          />
          <v-select
            v-if="stepKind === 'transform'"
            :model-value="transformField"
            :items="fieldNames"
            label="Target field"
            variant="outlined"
            density="compact"
            style="min-width: 220px"
            class="flex-grow-1"
            hide-details
            :rules="[(v: string) => !!v || 'Field is required']"
            @update:model-value="setField($event)"
          />
        </div>

        <div class="text-caption text-medium-emphasis mb-1">Expression</div>
        <div class="expr-wrapper pa-2">
          <ExprEditor
            :model-value="exprValue"
            :fields="fieldNames"
            :forbidden-ops="transformForbiddenOps"
            @update:model-value="setExpr($event)"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.drag-handle {
  cursor: grab;
}
.expr-wrapper {
  background: rgba(var(--v-theme-on-surface), 0.04);
  border-radius: 4px;
}
.step-row.sortable-ghost {
  opacity: 0.5;
}
</style>

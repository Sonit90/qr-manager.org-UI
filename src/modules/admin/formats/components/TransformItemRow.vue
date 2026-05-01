<script setup lang="ts">
import { computed } from 'vue'
import type {
  TypeOutputColumnV1,
  TypeTransformItemV1,
} from '@/api/__generated__/v1/data-contracts.ts'
import ExprEditor from '@/modules/admin/formats/components/ExprEditor.vue'
import {
  type Expr,
  defaultLiteralExprForColType,
  forbiddenOpsForColType,
} from '@/modules/admin/formats/types.ts'

const props = defineProps<{
  modelValue: TypeTransformItemV1
  index: number
  columns: TypeOutputColumnV1[]
}>()

const emit = defineEmits<{
  'update:modelValue': [item: TypeTransformItemV1]
  remove: []
}>()

const fieldItems = computed(() =>
  props.columns.map((c) => c.name).filter((n) => n.length > 0),
)

const targetCol = computed(() =>
  props.columns.find((c) => c.name === props.modelValue.field),
)

const forbiddenOps = computed(() => forbiddenOpsForColType(targetCol.value?.col_type))

const exprValue = computed<Expr>(() => props.modelValue.expr as Expr)

function setField(field: string) {
  const col = props.columns.find((c) => c.name === field)
  const expr = defaultLiteralExprForColType(col?.col_type)
  emit('update:modelValue', { field, expr: expr as unknown as object })
}

function setExpr(expr: Expr) {
  emit('update:modelValue', {
    field: props.modelValue.field,
    expr: expr as unknown as object,
  })
}
</script>

<template>
  <v-card variant="flat" class="transform-item pa-2 mb-2">
    <div class="d-flex align-start ga-2">
      <v-icon class="item-drag-handle mt-3" icon="mdi-drag-vertical" />
      <div class="flex-grow-1">
        <div class="d-flex align-center ga-2 mb-2">
          <span class="text-caption text-medium-emphasis">#{{ index + 1 }}</span>
          <v-select
            :model-value="modelValue.field"
            :items="fieldItems"
            label="Target column"
            variant="outlined"
            density="compact"
            hide-details
            style="min-width: 220px"
            class="flex-grow-1"
            @update:model-value="setField($event)"
          />
          <v-spacer />
          <v-btn
            size="small"
            variant="text"
            color="error"
            icon="mdi-close"
            title="Remove transform"
            @click="emit('remove')"
          />
        </div>
        <div class="text-caption text-medium-emphasis mb-1">Expression</div>
        <div class="expr-wrapper pa-2">
          <ExprEditor
            :model-value="exprValue"
            :fields="fieldItems"
            :forbidden-ops="forbiddenOps"
            @update:model-value="setExpr($event)"
          />
        </div>
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.item-drag-handle {
  cursor: grab;
}
.transform-item {
  background: rgba(var(--v-theme-on-surface), 0.04);
}
.transform-item.sortable-ghost {
  opacity: 0.5;
}
.expr-wrapper {
  background: rgba(var(--v-theme-on-surface), 0.06);
  border-radius: 4px;
}
</style>

<script setup lang="ts">
defineProps<{
  isEditing?: boolean
  icon?: string
  label: string
}>()

const model = defineModel<string | null | undefined>()
</script>

<template>
  <v-list-item>
    <template v-if="icon" #prepend>
      <v-icon color="primary" size="small">{{ icon }}</v-icon>
    </template>
    <div class="editable-container">
      <span class="text-body-2">{{ label }}</span>
      <v-text-field v-if="isEditing" v-model.trim="model" density="compact" hide-details />
    </div>
    <template #append>
      <slot>
        <span v-if="!isEditing" class="text-body-2 text-medium-emphasis">
          {{ model }}
        </span>
      </slot>
    </template>
  </v-list-item>
</template>
<style scoped>
.editable-container {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'

type ValidationRule = (value: string) => boolean | string

const model = defineModel<string>()

withDefaults(
  defineProps<{
    label: string
    rules?: ValidationRule[]
    icon?: string
  }>(),
  {
    rules: () => [],
    icon: 'mdi-lock',
  },
)

const show = ref(false)
</script>

<template>
  <v-text-field
    v-model.trim="model"
    :rules="rules"
    :type="show ? 'text' : 'password'"
    :label="label"
    :prepend-inner-icon="icon"
    variant="outlined"
    color="primary"
    required
  >
    <template #append-inner>
      <v-icon tabindex="-1" @click="show = !show">
        {{ show ? 'mdi-eye' : 'mdi-eye-off' }}
      </v-icon>
    </template>
  </v-text-field>
</template>

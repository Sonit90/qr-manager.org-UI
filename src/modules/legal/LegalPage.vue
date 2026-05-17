<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

defineProps<{ title: string }>()
</script>

<template>
  <div class="legal-page">
    <AppHeader variant="marketing" />
    <main class="app-container legal-main">
      <h1 class="legal-title">{{ title }}</h1>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.legal-page {
  color: var(--ink);
  background: var(--bg);
}

.legal-main {
  padding: 96px 24px;
  min-height: calc(100vh - var(--header-height) - 200px);
}

.legal-title {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0;
}
</style>

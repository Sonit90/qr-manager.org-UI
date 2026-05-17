<script setup lang="ts">
const stats = [
  { value: '50,000+', label: 'QR Codes Generated' },
  { value: '10,000+', label: 'Active Users' },
  { value: '99.99%', label: 'Redirect Uptime' },
]
</script>

<template>
  <section class="section section-stats">
    <div class="app-container stats-grid">
      <div v-for="s in stats" :key="s.label" class="stat">
        <div class="stat-value">{{ s.value }}</div>
        <div class="stat-label">{{ s.label }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  position: relative;
}

.section-stats {
  background: var(--ink);
  color: #fff;
  padding: 64px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  text-align: center;
}

.stat-value {
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 800;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #a5b4fc, #c4b5fd);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stat-label {
  color: #cbd5e1;
  margin-top: 6px;
  font-size: 14.5px;
}

@media (max-width: 960px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
</style>

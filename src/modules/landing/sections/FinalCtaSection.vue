<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.ts'

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

const primaryCtaTo = computed(() => (isAuthenticated.value ? '/qrs' : '/register'))
const finalCtaLabel = computed(() =>
  isAuthenticated.value ? 'Go to My QRs' : 'Get Started Free',
)
</script>

<template>
  <section class="section section-final">
    <div class="app-container final-inner">
      <h2 class="final-title">Start Creating Dynamic QR Codes Today</h2>
      <p class="final-sub">No signup friction. Build your first QR code in under a minute.</p>
      <a :href="primaryCtaTo" class="app-btn app-btn-primary app-btn-lg">
        {{ finalCtaLabel }}
        <v-icon icon="mdi-arrow-right" size="18" />
      </a>
    </div>
  </section>
</template>

<style scoped>
.section {
  position: relative;
}

.section-final {
  background: var(--gradient);
  color: #fff;
  padding: 88px 0;
  position: relative;
  overflow: hidden;
}

.section-final::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.18), transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.14), transparent 45%);
  pointer-events: none;
}

.final-inner {
  position: relative;
  text-align: center;
  max-width: 680px;
}

.final-title {
  font-size: clamp(28px, 3.8vw, 44px);
  font-weight: 800;
  letter-spacing: -0.015em;
  margin: 0 0 14px;
}

.final-sub {
  color: rgba(255, 255, 255, 0.88);
  font-size: 17px;
  margin: 0 0 28px;
}

.section-final .app-btn-primary {
  background: #fff;
  color: var(--accent);
  box-shadow: 0 12px 30px -10px rgba(0, 0, 0, 0.3);
}

.section-final .app-btn-primary :deep(.v-icon) {
  color: var(--accent);
}
</style>

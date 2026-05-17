<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.ts'

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

const primaryCtaTo = computed(() => (isAuthenticated.value ? '/qrs' : '/register'))
const primaryCtaLabel = computed(() =>
  isAuthenticated.value ? 'Go to My QRs' : 'Create Free QR Code',
)
</script>

<template>
  <section id="pricing" class="section section-pricing">
    <div class="app-container">
      <div class="section-head">
        <span class="app-eyebrow">Pricing</span>
        <h2 class="section-title">Free forever. No catch.</h2>
        <p class="section-sub">
          One plan. Every feature. No credit card, no trial timers, no usage caps.
        </p>
      </div>

      <div class="pricing-card">
        <div class="pricing-badge">100% Free</div>
        <div class="pricing-price">
          <span class="price-amount">$0</span>
          <span class="price-period">/ forever</span>
        </div>
        <ul class="pricing-features">
          <li><v-icon icon="mdi-check-circle" size="18" /> Unlimited dynamic QR codes</li>
          <li><v-icon icon="mdi-check-circle" size="18" /> Editable destinations</li>
          <li><v-icon icon="mdi-check-circle" size="18" /> Disable &amp; reactivate anytime</li>
          <li><v-icon icon="mdi-check-circle" size="18" /> Scan analytics</li>
          <li><v-icon icon="mdi-check-circle" size="18" /> 99.99% redirect uptime</li>
        </ul>
        <a :href="primaryCtaTo" class="app-btn app-btn-primary app-btn-lg app-btn-block">
          {{ primaryCtaLabel }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 96px 0;
  position: relative;
}

.section-pricing {
  background: #fff;
}

.section-head {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 56px;
}

.section-head .app-eyebrow {
  margin-bottom: 14px;
}

.section-title {
  font-size: clamp(28px, 3.6vw, 42px);
  line-height: 1.15;
  letter-spacing: -0.015em;
  font-weight: 800;
  margin: 0 0 14px;
}

.section-sub {
  font-size: 17px;
  color: var(--muted);
  margin: 0;
}

.pricing-card {
  max-width: 460px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 36px 32px;
  text-align: center;
  position: relative;
  box-shadow: 0 30px 60px -30px rgba(15, 23, 42, 0.18);
}

.pricing-badge {
  display: inline-block;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: 999px;
  margin-bottom: 18px;
}

.pricing-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  margin-bottom: 24px;
}

.price-amount {
  font-size: 56px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.price-period {
  color: var(--muted);
  font-size: 15px;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin: 0 0 28px;
  text-align: left;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: var(--ink-2);
  font-size: 14.5px;
}

.pricing-features :deep(.v-icon) {
  color: var(--accent);
}

@media (max-width: 960px) {
  .section {
    padding: 72px 0;
  }
}
</style>

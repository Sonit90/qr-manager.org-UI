<script setup lang="ts">
const faqs = [
  {
    q: 'Are dynamic QR codes really free?',
    a: 'Yes. Every feature is free with no subscriptions, no trial limits, and no hidden costs.',
  },
  {
    q: 'Can I change the link later?',
    a: 'Absolutely. Update the destination URL anytime from your dashboard. The QR code itself never changes.',
  },
  {
    q: 'Can I disable a QR code temporarily?',
    a: 'Yes. Toggle any QR off to show a friendly "disabled" page, then reactivate it whenever you want.',
  },
  {
    q: 'Is there a limit on QR codes?',
    a: 'No. Create as many QR codes as you need. There are no per-account or per-month caps.',
  },
]
</script>

<template>
  <section id="faq" class="section section-faq">
    <div class="app-container faq-container">
      <div class="section-head">
        <span class="app-eyebrow">FAQ</span>
        <h2 class="section-title">Questions, answered</h2>
      </div>

      <v-expansion-panels variant="accordion" class="faq-panels">
        <v-expansion-panel v-for="item in faqs" :key="item.q" :title="item.q" :text="item.a" />
      </v-expansion-panels>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 96px 0;
  position: relative;
}

.section-faq {
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

.faq-container {
  max-width: 760px;
}

.faq-panels {
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--line);
}

.faq-panels :deep(.v-expansion-panel-title) {
  font-weight: 600;
  color: var(--ink);
}

@media (max-width: 960px) {
  .section {
    padding: 72px 0;
  }
}
</style>

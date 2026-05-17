<script setup lang="ts">
const features = [
  {
    icon: 'mdi-link-variant',
    title: 'Edit Destination Anytime',
    text: 'Change the target URL without reprinting your QR code.',
  },
  {
    icon: 'mdi-toggle-switch',
    title: 'Disable or Reactivate',
    text: 'Temporarily disable QR codes or bring them back online instantly.',
  },
  {
    icon: 'mdi-infinity',
    title: 'Unlimited QR Codes',
    text: 'Create and manage as many QR codes as you want.',
  },
  {
    icon: 'mdi-gift-outline',
    title: 'Completely Free',
    text: 'No subscriptions, no hidden costs, no limits.',
  },
]
</script>

<template>
  <section id="features" class="section section-features">
    <div class="app-container">
      <div class="section-head">
        <span class="app-eyebrow">Features</span>
        <h2 class="section-title">Everything you need, nothing you don't</h2>
        <p class="section-sub">
          Built for marketers, makers, and businesses who want full control over their QR codes.
        </p>
      </div>

      <div class="feature-grid">
        <article v-for="f in features" :key="f.title" class="feature-card">
          <div class="feature-icon">
            <v-icon :icon="f.icon" size="24" />
          </div>
          <h3 class="feature-title">{{ f.title }}</h3>
          <p class="feature-text">{{ f.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 96px 0;
  position: relative;
}

.section-features {
  background: var(--bg-soft);
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

.feature-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 28px 24px;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card);
  border-color: var(--line-strong);
}

.feature-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-soft);
  color: var(--accent);
  margin-bottom: 18px;
}

.feature-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px;
}

.feature-text {
  color: var(--muted);
  font-size: 14.5px;
  margin: 0;
}

@media (max-width: 960px) {
  .section {
    padding: 72px 0;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }
}
</style>

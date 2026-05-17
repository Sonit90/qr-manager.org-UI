<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Create a QR code',
    text: 'Sign up free and generate your first dynamic QR code in seconds.',
    icon: 'mdi-qrcode-plus',
  },
  {
    number: '02',
    title: 'Share or print it anywhere',
    text: 'Use it on packaging, posters, business cards, or digital channels.',
    icon: 'mdi-share-variant',
  },
  {
    number: '03',
    title: 'Update the destination whenever needed',
    text: 'Point the same QR to a new URL anytime, without reprinting.',
    icon: 'mdi-refresh',
  },
]
</script>

<template>
  <section id="how-it-works" class="section section-how">
    <div class="app-container">
      <div class="section-head">
        <span class="app-eyebrow">How it works</span>
        <h2 class="section-title">From zero to live in 60 seconds</h2>
      </div>

      <ol class="steps">
        <li v-for="step in steps" :key="step.number" class="step">
          <div class="step-number">{{ step.number }}</div>
          <div class="step-icon">
            <v-icon :icon="step.icon" size="22" />
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-text">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding: 96px 0;
  position: relative;
}

.section-how {
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

.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.step {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 28px 24px;
  position: relative;
  transition: transform 0.25s ease;
}

.step:hover {
  transform: translateY(-3px);
}

.step-number {
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 0.08em;
  margin-bottom: 16px;
}

.step-icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient);
  color: #fff;
  margin-bottom: 16px;
}

.step-title {
  font-size: 17px;
  font-weight: 700;
  margin: 0 0 8px;
}

.step-text {
  color: var(--muted);
  font-size: 14.5px;
  margin: 0;
}

@media (max-width: 960px) {
  .section {
    padding: 72px 0;
  }

  .steps {
    grid-template-columns: 1fr;
  }
}
</style>

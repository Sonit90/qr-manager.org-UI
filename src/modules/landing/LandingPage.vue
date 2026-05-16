<script setup lang="ts">
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

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

const stats = [
  { value: '50,000+', label: 'QR Codes Generated' },
  { value: '10,000+', label: 'Active Users' },
  { value: '99.99%', label: 'Redirect Uptime' },
]

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

const primaryCtaTo = computed(() => (isAuthenticated.value ? '/qrs' : '/register'))
const primaryCtaLabel = computed(() =>
  isAuthenticated.value ? 'Go to My QRs' : 'Create Free QR Code',
)
const finalCtaLabel = computed(() =>
  isAuthenticated.value ? 'Go to My QRs' : 'Get Started Free',
)

function scrollTo(hash: string) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="landing">
    <AppHeader variant="marketing" />

    <!-- HERO -->
    <section class="hero">
      <div class="bg-blob blob-1" aria-hidden="true" />
      <div class="bg-blob blob-2" aria-hidden="true" />
      <div class="bg-grid" aria-hidden="true" />

      <div class="app-container hero-inner">
        <div class="hero-copy">
          <span class="eyebrow">
            <span class="eyebrow-dot" />
            Free forever · No credit card
          </span>
          <h1 class="hero-title">
            Dynamic QR Codes
            <span class="title-accent">That You Control</span>
          </h1>
          <p class="hero-sub">
            Create free QR codes with editable destinations. Change links anytime, disable or
            reactivate codes instantly, and manage unlimited QR codes from one dashboard.
          </p>
          <div class="hero-ctas">
            <a :href="primaryCtaTo" class="app-btn app-btn-primary app-btn-lg">
              {{ primaryCtaLabel }}
              <v-icon icon="mdi-arrow-right" size="18" />
            </a>
            <a
              href="#how-it-works"
              class="app-btn app-btn-ghost app-btn-lg"
              @click.prevent="scrollTo('#how-it-works')"
            >
              See How It Works
            </a>
          </div>
          <div class="hero-trust">
            <div class="avatars">
              <span class="avatar" />
              <span class="avatar" />
              <span class="avatar" />
              <span class="avatar" />
            </div>
            <span>Joined by 10,000+ creators &amp; businesses</span>
          </div>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <div class="qr-card float-slow">
            <div class="qr-card-head">
              <span class="dot dot-r" />
              <span class="dot dot-y" />
              <span class="dot dot-g" />
            </div>
            <div class="qr-image">
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <rect width="100" height="100" fill="#fff" />
                <g fill="#0f172a">
                  <rect x="6" y="6" width="22" height="22" rx="3" />
                  <rect x="10" y="10" width="14" height="14" rx="1" fill="#fff" />
                  <rect x="14" y="14" width="6" height="6" rx="1" />
                  <rect x="72" y="6" width="22" height="22" rx="3" />
                  <rect x="76" y="10" width="14" height="14" rx="1" fill="#fff" />
                  <rect x="80" y="14" width="6" height="6" rx="1" />
                  <rect x="6" y="72" width="22" height="22" rx="3" />
                  <rect x="10" y="76" width="14" height="14" rx="1" fill="#fff" />
                  <rect x="14" y="80" width="6" height="6" rx="1" />
                  <g>
                    <rect x="34" y="8" width="5" height="5" />
                    <rect x="42" y="8" width="5" height="5" />
                    <rect x="56" y="8" width="5" height="5" />
                    <rect x="34" y="16" width="5" height="5" />
                    <rect x="50" y="16" width="5" height="5" />
                    <rect x="64" y="16" width="5" height="5" />
                    <rect x="8" y="34" width="5" height="5" />
                    <rect x="16" y="34" width="5" height="5" />
                    <rect x="24" y="34" width="5" height="5" />
                    <rect x="34" y="34" width="5" height="5" />
                    <rect x="42" y="34" width="5" height="5" />
                    <rect x="50" y="34" width="5" height="5" />
                    <rect x="64" y="34" width="5" height="5" />
                    <rect x="72" y="34" width="5" height="5" />
                    <rect x="80" y="34" width="5" height="5" />
                    <rect x="88" y="34" width="5" height="5" />
                    <rect x="34" y="42" width="5" height="5" />
                    <rect x="50" y="42" width="5" height="5" />
                    <rect x="58" y="42" width="5" height="5" />
                    <rect x="72" y="42" width="5" height="5" />
                    <rect x="88" y="42" width="5" height="5" />
                    <rect x="8" y="50" width="5" height="5" />
                    <rect x="24" y="50" width="5" height="5" />
                    <rect x="34" y="50" width="5" height="5" />
                    <rect x="42" y="50" width="5" height="5" />
                    <rect x="58" y="50" width="5" height="5" />
                    <rect x="72" y="50" width="5" height="5" />
                    <rect x="80" y="50" width="5" height="5" />
                    <rect x="8" y="58" width="5" height="5" />
                    <rect x="16" y="58" width="5" height="5" />
                    <rect x="42" y="58" width="5" height="5" />
                    <rect x="50" y="58" width="5" height="5" />
                    <rect x="64" y="58" width="5" height="5" />
                    <rect x="80" y="58" width="5" height="5" />
                    <rect x="88" y="58" width="5" height="5" />
                    <rect x="34" y="66" width="5" height="5" />
                    <rect x="42" y="66" width="5" height="5" />
                    <rect x="56" y="66" width="5" height="5" />
                    <rect x="64" y="66" width="5" height="5" />
                    <rect x="72" y="66" width="5" height="5" />
                    <rect x="88" y="66" width="5" height="5" />
                    <rect x="34" y="74" width="5" height="5" />
                    <rect x="50" y="74" width="5" height="5" />
                    <rect x="64" y="74" width="5" height="5" />
                    <rect x="80" y="74" width="5" height="5" />
                    <rect x="88" y="74" width="5" height="5" />
                    <rect x="42" y="82" width="5" height="5" />
                    <rect x="56" y="82" width="5" height="5" />
                    <rect x="72" y="82" width="5" height="5" />
                    <rect x="80" y="82" width="5" height="5" />
                    <rect x="34" y="90" width="5" height="5" />
                    <rect x="50" y="90" width="5" height="5" />
                    <rect x="64" y="90" width="5" height="5" />
                    <rect x="88" y="90" width="5" height="5" />
                  </g>
                </g>
              </svg>
            </div>
            <div class="qr-card-foot">
              <span>scan to visit</span>
              <strong>qr.app/abc123</strong>
            </div>
          </div>

          <div class="chip chip-url float-a">
            <v-icon icon="mdi-link-variant" size="16" />
            <div>
              <div class="chip-label">Destination URL</div>
              <div class="chip-value">acme.com/spring-sale</div>
            </div>
            <v-icon icon="mdi-pencil-outline" size="14" class="chip-action" />
          </div>

          <div class="chip chip-status float-b">
            <span class="status-dot" />
            <div>
              <div class="chip-label">QR Status</div>
              <div class="chip-value">Active</div>
            </div>
          </div>

          <div class="chip chip-analytics float-c">
            <div class="chip-label">Scans · 7d</div>
            <div class="chip-value">2,418</div>
            <svg viewBox="0 0 60 20" class="sparkline" width="60" height="20">
              <polyline
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                points="0,14 10,11 20,13 30,7 40,9 50,4 60,6"
              />
            </svg>
          </div>

          <div class="chip chip-unlimited float-d">
            <v-icon icon="mdi-infinity" size="16" />
            <span>Unlimited QRs</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
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

    <!-- PRICING -->
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

    <!-- HOW IT WORKS -->
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

    <!-- SOCIAL PROOF -->
    <section class="section section-stats">
      <div class="app-container stats-grid">
        <div v-for="s in stats" :key="s.label" class="stat">
          <div class="stat-value">{{ s.value }}</div>
          <div class="stat-label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
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

    <!-- FINAL CTA -->
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

    <AppFooter />
  </div>
</template>

<style scoped>
.landing {
  color: var(--ink);
  background: var(--bg);
  line-height: 1.55;
}

/* HERO */
.hero {
  position: relative;
  overflow: hidden;
  padding: 88px 0 110px;
}

.hero-inner {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 56px;
  align-items: center;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--accent-soft);
  color: var(--accent);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 22px;
}

.eyebrow-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.18);
}

.hero-title {
  font-size: clamp(38px, 5.2vw, 64px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  font-weight: 800;
  margin: 0 0 22px;
}

.title-accent {
  display: block;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.hero-sub {
  font-size: 17.5px;
  color: var(--muted);
  max-width: 540px;
  margin: 0 0 32px;
}

.hero-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 28px;
}

.hero-trust {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--muted);
  font-size: 14px;
}

.avatars {
  display: inline-flex;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #fff;
  background: linear-gradient(135deg, #c7d2fe, #ddd6fe);
  margin-left: -8px;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
}

.avatar:first-child {
  margin-left: 0;
  background: linear-gradient(135deg, #fbcfe8, #fda4af);
}

.avatar:nth-child(2) {
  background: linear-gradient(135deg, #bae6fd, #a5f3fc);
}

.avatar:nth-child(3) {
  background: linear-gradient(135deg, #bbf7d0, #a7f3d0);
}

/* HERO VISUAL */
.hero-visual {
  position: relative;
  min-height: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-card {
  position: relative;
  width: 280px;
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 30px 60px -25px rgba(15, 23, 42, 0.35);
  border: 1px solid var(--line);
  padding: 14px;
  z-index: 2;
}

.qr-card-head {
  display: flex;
  gap: 6px;
  padding-bottom: 12px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-r {
  background: #f87171;
}

.dot-y {
  background: #fbbf24;
}

.dot-g {
  background: #34d399;
}

.qr-image {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 14px;
}

.qr-card-foot {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 6px 4px;
  gap: 2px;
  font-size: 12.5px;
  color: var(--muted);
}

.qr-card-foot strong {
  color: var(--ink);
  font-size: 13.5px;
}

.chip {
  position: absolute;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px 14px;
  box-shadow: 0 18px 40px -20px rgba(15, 23, 42, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  z-index: 3;
}

.chip-label {
  font-size: 11px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
}

.chip-value {
  font-size: 13.5px;
  color: var(--ink);
  font-weight: 600;
}

.chip-action {
  margin-left: 6px;
  color: var(--accent);
}

.chip-url {
  top: 8%;
  left: -4%;
  max-width: 240px;
}

.chip-status {
  top: 22%;
  right: -4%;
}

.status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.18);
}

.chip-analytics {
  bottom: 18%;
  left: -8%;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  color: var(--accent);
}

.chip-analytics .chip-value {
  font-size: 18px;
}

.sparkline {
  margin-top: 2px;
}

.chip-unlimited {
  bottom: 10%;
  right: -2%;
  background: var(--ink);
  color: #fff;
  border-color: var(--ink);
  font-size: 13px;
  font-weight: 600;
}

.chip-unlimited :deep(.v-icon) {
  color: #c7d2fe;
}

/* HERO BG */
.bg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  z-index: 0;
  pointer-events: none;
}

.blob-1 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.55), transparent 70%);
  top: -160px;
  left: -120px;
  animation: drift1 18s ease-in-out infinite;
}

.blob-2 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.45), transparent 70%);
  bottom: -200px;
  right: -160px;
  animation: drift2 22s ease-in-out infinite;
}

.bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(15, 23, 42, 0.04) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(circle at center, #000 30%, transparent 75%);
  z-index: 0;
}

@keyframes drift1 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(40px, 30px);
  }
}

@keyframes drift2 {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-50px, -30px);
  }
}

.float-slow {
  animation: floatY 6s ease-in-out infinite;
}

.float-a {
  animation: floatY 5s ease-in-out infinite;
}

.float-b {
  animation: floatY 7s ease-in-out infinite;
  animation-delay: -1.5s;
}

.float-c {
  animation: floatY 6.5s ease-in-out infinite;
  animation-delay: -2.5s;
}

.float-d {
  animation: floatY 5.5s ease-in-out infinite;
  animation-delay: -3s;
}

@keyframes floatY {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* SECTIONS */
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

/* FEATURES */
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

/* PRICING */
.section-pricing {
  background: #fff;
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

/* HOW IT WORKS */
.section-how {
  background: var(--bg-soft);
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

/* STATS */
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

/* FAQ */
.section-faq {
  background: #fff;
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

/* FINAL CTA */
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

/* RESPONSIVE */
@media (max-width: 960px) {
  .hero {
    padding: 64px 0 88px;
  }

  .hero-inner {
    grid-template-columns: 1fr;
    gap: 64px;
  }

  .hero-copy {
    text-align: center;
  }

  .eyebrow {
    margin-inline: auto;
  }

  .hero-sub {
    margin-inline: auto;
  }

  .hero-ctas {
    justify-content: center;
  }

  .hero-trust {
    justify-content: center;
  }

  .feature-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .section {
    padding: 72px 0;
  }
}

@media (max-width: 560px) {
  .feature-grid {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: 420px;
    transform: scale(0.92);
  }
}
</style>

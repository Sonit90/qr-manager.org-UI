<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/userStore.ts'
import HeroQr from '../assets/hero-qr.svg?component'
import Sparkline from '../assets/sparkline.svg?component'

const userStore = useUserStore()
const { isAuthenticated } = storeToRefs(userStore)

const primaryCtaTo = computed(() => (isAuthenticated.value ? '/qrs' : '/register'))
const primaryCtaLabel = computed(() =>
  isAuthenticated.value ? 'Go to My QRs' : 'Create Free QR Code',
)

function scrollTo(hash: string) {
  const el = document.querySelector(hash)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
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
            <HeroQr />
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
          <Sparkline class="sparkline" />
        </div>

        <div class="chip chip-unlimited float-d">
          <v-icon icon="mdi-infinity" size="16" />
          <span>Unlimited QRs</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
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
}

@media (max-width: 560px) {
  .hero-visual {
    min-height: 420px;
    transform: scale(0.92);
  }
}
</style>

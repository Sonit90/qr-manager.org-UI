<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import HeroSection from './sections/HeroSection.vue'
import FeaturesSection from './sections/FeaturesSection.vue'
import PricingSection from './sections/PricingSection.vue'
import HowItWorksSection from './sections/HowItWorksSection.vue'
import StatsSection from './sections/StatsSection.vue'
import FaqSection from './sections/FaqSection.vue'
import FinalCtaSection from './sections/FinalCtaSection.vue'
</script>

<template>
  <div class="landing">
    <AppHeader variant="marketing" />
    <HeroSection />
    <FeaturesSection />
    <PricingSection />
    <HowItWorksSection />
    <StatsSection />
    <FaqSection />
    <FinalCtaSection />
    <AppFooter />
  </div>
</template>

<style scoped>
.landing {
  color: var(--ink);
  background: var(--bg);
  line-height: 1.55;
}
</style>

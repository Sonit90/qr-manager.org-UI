<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="app-container footer-inner">
      <div class="footer-brand">
        <span class="logo-mark">
          <v-icon icon="mdi-qrcode" size="18" />
        </span>
        <span>QR Manager</span>
      </div>
      <nav class="footer-links" aria-label="Footer">
        <router-link to="/privacy">Privacy Policy</router-link>
        <router-link to="/terms">Terms of Service</router-link>
        <router-link to="/contact">Contact</router-link>
      </nav>
      <small class="footer-copy">&copy; {{ year }} QR Manager. All rights reserved.</small>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #fff;
  border-top: 1px solid var(--line);
  padding: 28px 0;
}

.footer-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: var(--ink);
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: var(--gradient);
  color: #fff;
}

.footer-links {
  display: flex;
  gap: 22px;
}

.footer-links a {
  color: var(--muted);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--ink);
}

.footer-copy {
  color: var(--muted);
  font-size: 13px;
}

@media (max-width: 640px) {
  .footer-inner {
    flex-direction: column;
    text-align: center;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>

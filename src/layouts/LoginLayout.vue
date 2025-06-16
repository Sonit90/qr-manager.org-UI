<template>
  <div class="d-flex align-center justify-center pa-5 login-gradient">
    <div class="login-layout">
      <router-view />
    </div>
  </div>
</template>
<style scoped>
.login-gradient {
  background-image: linear-gradient(to bottom right, #6366f1, #8b5cf6);
  height: 100%;
}

.login-layout {
  width: 100%;
  max-width: 28rem;
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>

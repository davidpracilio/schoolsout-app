<template>
  <div class="landing-page">
    <div class="landing-content">
      <img src="../assets/capybara.jpg" alt="Schools Out Logo" class="landing-logo" />
      <h1 class="landing-title">Schools Out</h1>
      <p class="landing-subtitle">Find amazing activities for kids during school holidays</p>
      <button class="cta-button" @click="$emit('enter')">
        Get Started
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['enter'])
</script>

<style scoped>
.landing-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-color: #4EAFD9;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 9999;
}

.landing-content {
  text-align: center;
  max-width: 500px;
  width: 100%;
  margin-top: -60px;
}

.landing-logo {
  width: 120px;
  height: 120px;
  border-radius: 30px;
  object-fit: cover;
  margin: 0 auto 24px;
  display: block;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.landing-title {
  color: white;
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  font-family: 'Fredoka', sans-serif;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.landing-subtitle {
  color: rgba(255, 255, 255, 0.95);
  font-size: 18px;
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.cta-button {
  background-color: white;
  color: #4EAFD9;
  border: none;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cta-button:hover {
  background-color: #f0f0f0;
}

.cta-button:active {
  background-color: #e0e0e0;
}

@media (min-width: 768px) {
  .landing-logo {
    width: 150px;
    height: 150px;
    margin-bottom: 32px;
  }
  
  .landing-title {
    font-size: 64px;
    margin-bottom: 20px;
  }
  
  .landing-subtitle {
    font-size: 20px;
    margin-bottom: 48px;
  }
  
  .cta-button {
    padding: 18px 48px;
    font-size: 20px;
  }
}
</style>

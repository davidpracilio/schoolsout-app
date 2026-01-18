<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section">
        <img src="../assets/capybara.jpg" alt="Schools Out Logo" class="logo-icon" />
        <h1 class="app-title">Schools Out</h1>
      </div>
      <button class="menu-button" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </header>
</template>

<script setup>
// No props or logic needed for basic header
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #4EAFD9;
  z-index: 1000;
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 20px;
  min-height: 72px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  object-fit: cover;
}

.app-title {
  color: white;
  font-size: 22px;
  font-weight: 600;
  margin: 0;  
  font-family: 'Fredoka', sans-serif;
}

.menu-button {
  background: none;
  border: 2px solid rgba(255, 255, 255, 0.6);
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-button:active {
  background-color: rgba(255, 255, 255, 0.2);
}

.menu-button svg {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .header-content {
    max-width: 1200px;
    padding: 12px 24px;
  }
  
  .logo-section {
    flex: 1;
  }
  
  .menu-button {
    margin-left: auto;
  }
}
</style>

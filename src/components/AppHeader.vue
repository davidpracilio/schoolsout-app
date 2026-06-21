<template>
  <header class="app-header">
    <div class="header-content">
      <div class="logo-section" @click="$emit('go-home')" style="cursor: pointer;">
        <img src="../assets/capybara.jpg" alt="Schools Out Logo" class="logo-icon" />
        <h1 class="app-title">Schools Out</h1>
      </div>
      <button class="menu-button" @click="toggleMenu" aria-label="Menu">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12H21M3 6H21M3 18H21" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
    <transition name="slide">
      <div v-show="menuOpen" class="menu-overlay" @click="closeMenu">
        <div class="menu-content" @click.stop>
        <button class="close-button" @click="closeMenu">×</button>
        <nav class="menu-nav">
          <a @click="handleHome" class="menu-link">Home</a>
          <a @click="handleAbout" class="menu-link">About</a>
          <hr class="menu-divider" />
          <a @click="handleSaved" class="menu-link menu-link--saved">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="menu-heart-icon">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                stroke="#6b7280" stroke-width="1.5" fill="none"/>
            </svg>
            Saved
          </a>
        </nav>
      </div>
    </div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleHome = () => {
  closeMenu()
}

const handleAbout = () => {
  closeMenu()
}

const handleSaved = () => {
  closeMenu()
  emit('show-saved')
}

const emit = defineEmits(['go-home', 'show-saved'])
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

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.menu-content {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100%;
  background-color: white;
  padding: 24px;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
}

.slide-enter-from .menu-content {
  transform: translateX(100%);
}

.slide-enter-to {
  opacity: 1;
}

.slide-enter-to .menu-content {
  transform: translateX(0);
}

.slide-leave-from {
  opacity: 1;
}

.slide-leave-from .menu-content {
  transform: translateX(0);
}

.slide-leave-to {
  opacity: 0;
}

.slide-leave-to .menu-content {
  transform: translateX(100%);
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
}

.menu-nav {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-link {
  color: #333;
  text-decoration: none;
  font-size: 18px;
  font-weight: 500;
  padding: 4px 0;
  cursor: pointer;
  transition: color 0.2s;
}

.menu-link:hover {
  color: #4EAFD9;
}

.menu-divider {
  border: none;
  border-top: 1px solid #E0E0E0;
  margin: 8px 0;
}

.menu-link--saved {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-link--saved:hover {
  color: #4EAFD9;
}

.menu-link--saved:hover .menu-heart-icon path {
  stroke: #4EAFD9;
}

.menu-heart-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .menu-content {
    width: 300px;
  }
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

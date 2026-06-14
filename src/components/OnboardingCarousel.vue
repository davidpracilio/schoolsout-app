<template>
  <Transition name="carousel">
    <div v-if="isOpen" class="carousel-overlay" @click="handleOverlayClick">
      <div class="carousel-container" @click.stop>
        <!-- Close button -->
        <button class="close-button" @click="closeCarousel" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>

        <!-- Card -->
        <div class="card-wrapper">
          <!-- Blue Section (Top) -->
          <div class="card-blue-section">
            <img :src="heroImage" alt="Schools Out" class="card-image" />
          </div>

          <!-- White Section (Bottom) -->
          <div class="card-white-section">
            <div class="card-content">
              <h2 class="card-title">Welcome to Schools Out</h2>
              <div class="card-points">
                <div v-for="(point, index) in points" :key="index" class="point-item">
                  <div class="point-icon">
                    <svg v-if="point.icon === 'search'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="2"/>
                      <path d="M14 14L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else-if="point.icon === 'heart'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span class="point-text">{{ point.text }}</span>
                </div>
              </div>
            </div>
            <div class="card-bottom-section">
              <button class="nav-button nav-button-primary" @click="completeCarousel">
                Enter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import capybaraGn from '../assets/capybara-gn.jpg'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['complete'])

const heroImage = capybaraGn

const points = [
  { icon: 'search', text: "Tell us what you're looking for and where" },
  { icon: 'heart', text: 'Discover activities, parks, sports, arts and more' },
  { icon: 'location', text: 'Get key details — price, location and age range' }
]

const closeCarousel = () => {
  emit('complete', [])
}

const handleOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    closeCarousel()
  }
}

const completeCarousel = () => {
  emit('complete', [])
}
</script>

<style scoped>
.carousel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  overflow-y: auto;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s;
  z-index: 10;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.close-button svg {
  width: 20px;
  height: 20px;
  color: #666;
}

.card-wrapper {
  background-color: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
}

.card-blue-section {
  background: linear-gradient(135deg, #4EAFD9 0%, #3a9bc4 100%);
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-white-section {
  background-color: white;
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-bottom-section {
  display: flex;
  justify-content: flex-end;
}

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 16px 0;
  line-height: 1.3;
  text-align: center;
}

.card-points {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.point-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.point-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4EAFD9;
  margin-top: 2px;
}

.point-icon svg {
  width: 100%;
  height: 100%;
}

.point-text {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

.nav-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
}

.nav-button-primary {
  background-color: #4EAFD9;
  color: white;
}

.nav-button-primary:hover {
  background-color: #3a9bc4;
  box-shadow: 0 4px 12px rgba(78, 175, 217, 0.3);
}

/* Carousel transitions */
.carousel-enter-active,
.carousel-leave-active {
  transition: opacity 0.3s ease;
}

.carousel-enter-active .carousel-container,
.carousel-leave-active .carousel-container {
  transition: transform 0.3s ease;
}

.carousel-enter-from,
.carousel-leave-to {
  opacity: 0;
}

.carousel-enter-from .carousel-container,
.carousel-leave-to .carousel-container {
  transform: scale(0.9);
}

@media (min-width: 768px) {
  .card-blue-section {
    height: 200px;
  }

  .card-white-section {
    padding: 28px 32px 28px;
    gap: 24px;
  }

  .card-title {
    font-size: 26px;
    margin-bottom: 20px;
  }

  .point-text {
    font-size: 15px;
  }

  .nav-button {
    padding: 14px 32px;
    font-size: 16px;
  }
}
</style>

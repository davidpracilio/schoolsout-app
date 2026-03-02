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

        <!-- Card Container -->
        <div class="card-wrapper">
          <!-- Blue Section (Top) -->
          <div class="card-blue-section">
            <img :src="currentCard.image" :alt="currentCard.title" class="card-image" />
          </div>

          <!-- White Section (Bottom) -->
          <div class="card-white-section">
            <!-- Card Content -->
            <div class="card-content">
              <h2 class="card-title">{{ currentCard.title }}</h2>
              <div class="card-points">
                <div v-for="(point, index) in currentCard.points" :key="index" class="point-item">
                  <div class="point-icon">
                    <svg v-if="point.icon === 'search'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10" cy="10" r="6" stroke="currentColor" stroke-width="2"/>
                      <path d="M14 14L20 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <svg v-else-if="point.icon === 'location'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                    </svg>
                    <svg v-else-if="point.icon === 'heart'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" fill="currentColor"/>
                    </svg>
                    <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <span class="point-text">{{ point.text }}</span>
                </div>
              </div>
            </div>

            <!-- Bottom Section with Progress and Navigation -->
            <div class="card-bottom-section">
              <!-- Progress Indicator (Left) -->
              <div class="progress-indicator">
                <span class="progress-text">Step {{ currentCardIndex + 1 }} of {{ cards.length }}</span>
              </div>

              <!-- Navigation Buttons (Right) -->
              <div class="card-navigation">
                <button 
                  class="nav-button nav-button-secondary"
                  @click="previousCard"
                  :disabled="currentCardIndex === 0"
                >
                  Back
                </button>
                
                <button 
                  class="nav-button nav-button-primary"
                  @click="nextCard"
                >
                  {{ isLastCard ? 'Enter' : 'Next' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import capybaraGn from '../assets/capybara-gn.jpg'
import capybaraM from '../assets/capybara-mb.jpg'
import capybaraBa from '../assets/capybara-ba.jpg'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close', 'complete'])

const currentCardIndex = ref(0)

const cards = [
  {
    title: 'Welcome to Schools Out',
    image: capybaraBa,
    points: [
      { icon: 'search', text: 'Help you find activities for kids during school holidays' },
      { icon: 'heart', text: 'Discover parks, sports, arts, crafts, and so much more' },
      { icon: 'location', text: 'Quick access to key details - price, location and age' }
    ]
  },
  {
    title: 'How it works',
    image: capybaraM,
    points: [
      { icon: 'search', text: 'Enter search terms to describe what you\'re looking for' },
      { icon: 'location', text: 'Use your current location to discover what\'s nearby' },
      { icon: 'heart', text: 'The search engine will find some suggestions for you' },
      { icon: 'circle', text: 'Sit tight, it may take a moment to compile the results' }
    ]
  },
  {
    title: 'Explore your results',
    image: capybaraGn,
    points: [
      { icon: 'search', text: 'Results will display some handy tags and a link' },
      { icon: 'heart', text: 'Find stuff at short notice to keep kids entertained' },
      { icon: 'location', text: 'Perfect for planning your kid\'s school holidays' }
    ]
  }
]

const currentCard = computed(() => cards[currentCardIndex.value])
const isLastCard = computed(() => currentCardIndex.value === cards.length - 1)

const nextCard = () => {
  if (isLastCard.value) {
    completeCarousel()
  } else {
    currentCardIndex.value++
  }
}

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
  }
}

const closeCarousel = () => {
  completeCarousel()
}

const handleOverlayClick = (e) => {
  // Only close if clicking directly on overlay, not the container
  if (e.target === e.currentTarget) {
    closeCarousel()
  }
}

const completeCarousel = () => {
  emit('complete')
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
  height: 600px;
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
  height: 100%;
}

.card-blue-section {
  background: linear-gradient(135deg, #4EAFD9 0%, #3a9bc4 100%);
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.card-white-section {
  background-color: white;
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
  justify-content: space-between;
}

.card-bottom-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.progress-indicator {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  margin-top: 4px;
}

.progress-text {
  font-size: 13px;
  color: #bbb;
  font-weight: 500;
  letter-spacing: 0.5px;
}


.card-content {
  text-align: left;
}

.card-title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  line-height: 1.3;
  text-align: center;
}

.card-points {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.point-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.point-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
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
  font-size: 15px;
  color: #666;
  line-height: 1.5;
}

/* Mobile: Smaller font for points on small screens */
@media (max-width: 767px) {
  .point-text {
    font-size: 14px;
  }
}

.card-navigation {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.nav-button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
  width: 100px;
}

.nav-button-primary {
  background-color: #4EAFD9;
  color: white;
}

.nav-button-primary:hover:not(:disabled) {
  background-color: #3a9bc4;
  box-shadow: 0 4px 12px rgba(78, 175, 217, 0.3);
}

.nav-button-secondary {
  background-color: #f0f0f0;
  color: #666;
}

.nav-button-secondary:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.nav-button-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .card-wrapper {
    max-width: 550px;
  }

  .card-blue-section {
    height: 240px;
  }

  .placeholder-illustration {
    width: 140px;
    height: 140px;
  }

  .card-white-section {
    padding: 30px 32px 32px;
    gap: 28px;
  }

  .card-bottom-section {
    gap: 32px;
  }

  .card-title {
    font-size: 28px;
  }

  .point-text {
    font-size: 16px;
  }

  .nav-button {
    padding: 14px 32px;
    font-size: 16px;
  }
}
</style>

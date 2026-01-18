<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="closeModal">
      <div class="modal-container" @click.stop>
        <button class="close-button" @click="closeModal" aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
        
        <div class="modal-content">
          <div class="modal-header">
            <div class="modal-icon">
              <svg v-if="activity.icon === 'location'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                  fill="#666"/>
              </svg>
              <svg v-else-if="activity.icon === 'park'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 8C17 10.21 15.21 12 13 12H12V18H14V20H10V18H12V12H11C8.79 12 7 10.21 7 8C7 5.79 8.79 4 11 4C11.46 4 11.9 4.08 12.32 4.21C13.07 2.88 14.47 2 16 2C18.21 2 20 3.79 20 6C20 7.27 19.38 8.39 18.42 9.08C17.79 8.4 17 7.76 17 8Z" 
                  fill="#666"/>
              </svg>
              <svg v-else-if="activity.icon === 'beach'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.13 14.56L14.56 13.13L21.99 20.56L20.56 21.99L13.13 14.56ZM17.42 13.13L18.84 11.71C19.96 10.59 19.96 8.78 18.84 7.66C17.72 6.54 15.91 6.54 14.79 7.66L13.37 9.08L17.42 13.13ZM5.95 4.93C7.47 4.93 8.69 6.16 8.69 7.67C8.69 9.19 7.47 10.41 5.95 10.41C4.43 10.41 3.21 9.19 3.21 7.67C3.21 6.16 4.43 4.93 5.95 4.93ZM5.95 2.93C3.32 2.93 1.21 5.04 1.21 7.67C1.21 10.3 3.32 12.41 5.95 12.41C8.58 12.41 10.69 10.3 10.69 7.67C10.69 5.04 8.58 2.93 5.95 2.93Z" 
                  fill="#666"/>
              </svg>
              <svg v-else-if="activity.icon === 'hiking'" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.5 5.5C14.6 5.5 15.5 4.6 15.5 3.5C15.5 2.4 14.6 1.5 13.5 1.5C12.4 1.5 11.5 2.4 11.5 3.5C11.5 4.6 12.4 5.5 13.5 5.5ZM9.8 8.9L7 23H9.1L10.9 15L13 17V23H15V15.5L12.9 13.5L13.5 10.5C14.8 12 16.8 13 19 13V11C17.1 11 15.5 10 14.7 8.6L13.7 7C13.3 6.4 12.7 6 12 6C11.7 6 11.5 6.1 11.2 6.1L6 8.3V13H8V9.6L9.8 8.9Z" 
                  fill="#666"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                  fill="#666"/>
              </svg>
            </div>
            
            <div class="modal-title-section">
              <div class="modal-title-content">
                <h2 class="modal-title">{{ activity.name }}</h2>
                <p class="modal-description">{{ activity.description }}</p>
              </div>
              <button 
                class="favorite-button-modal"
                :class="{ active: activity.isFavorite }"
                @click="$emit('toggle-favorite')"
                aria-label="Toggle favorite"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
                    :fill="activity.isFavorite ? '#FFD700' : 'none'"
                    :stroke="activity.isFavorite ? 'none' : '#666'"
                    stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>
          
          <div class="modal-body">
            <!-- Placeholder for additional content -->
            <div class="modal-details">
              <h3>Details</h3>
              <p>More detailed information about this activity will appear here. This could include opening hours, pricing, age recommendations, facilities, and other relevant information.</p>
              
              <h3>Location</h3>
              <p>Address and location information will be displayed here.</p>
              
              <h3>Contact</h3>
              <p>Contact details and booking information will be shown here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  activity: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'toggle-favorite'])

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
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

.modal-container {
  background-color: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
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
  z-index: 1;
}

.close-button:hover {
  background-color: #f5f5f5;
}

.close-button svg {
  width: 20px;
  height: 20px;
  color: #666;
}

.modal-content {
  padding: 24px;
}

.modal-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.modal-icon {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background-color: #E0E0E0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-icon svg {
  width: 42px;
  height: 42px;
}

.modal-title-section {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-right: 44px;
}

.modal-title-content {
  flex: 1;
}

.modal-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.modal-description {
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.favorite-button-modal {
  flex-shrink: 0;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.favorite-button-modal:hover {
  transform: scale(1.1);
}

.favorite-button-modal svg {
  width: 28px;
  height: 28px;
}

.modal-body {
  color: #333;
}

.modal-details {
  border-top: 1px solid #E0E0E0;
  padding-top: 20px;
}

.modal-details h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.modal-details h3:not(:first-child) {
  margin-top: 20px;
}

.modal-details p {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9);
}

@media (min-width: 768px) {
  .modal-container {
    max-width: 700px;
  }
  
  .modal-content {
    padding: 32px;
  }
  
  .modal-icon {
    width: 100px;
    height: 100px;
  }
  
  .modal-icon svg {
    width: 50px;
    height: 50px;
  }
  
  .modal-title {
    font-size: 28px;
  }
}
</style>

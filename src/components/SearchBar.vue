<template>
  <div class="search-bar-container">
    <div class="search-bar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
          stroke="#999" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <input 
        type="text"
        class="search-input"
        :value="modelValue"
        @input="updateValue"
        @keyup.enter="handleSearch"
        :placeholder="currentPlaceholder"
        aria-label="Search for places and activities"
      />
      <button 
        v-if="hasSearched && modelValue.trim()"
        @click="searchAgain"
        class="search-again-button"
        aria-label="Search again"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4V9H4.58152M4.58152 9C5.27473 6.25329 7.6218 4 10.5 4C13.8053 4 16.5 6.69469 16.5 10C16.5 13.3053 13.8053 16 10.5 16C8.54305 16 6.85933 14.9708 5.78131 13.5M4.58152 9H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button 
        v-if="modelValue"
        @click="clearSearch"
        class="clear-button"
        aria-label="Clear search"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="#999" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  hasSearched: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'search-again'])

const placeholderTexts = [
  'fun activities for kids aged 8-12 for areas around perth, western australia',
  'school holiday programs for teenagers in sydney, new south wales',
  'outdoor drop and leave activities for kids aged 5-10 in melbourne, victoria',
  'indoor activities for preschoolers during school holidays in brisbane, queensland',
  'family-friendly museums and attractions in canberra, act',
  'beach activities and water sports for kids on the gold coast, queensland',
  'creative workshops and art classes for children aged 7-14 in adelaide, south australia',
  'nature and wildlife experiences for families in hobart, tasmania'
]

const currentPlaceholder = ref(placeholderTexts[0])
let placeholderIndex = 0
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length
    currentPlaceholder.value = placeholderTexts[placeholderIndex]
  }, 6000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleSearch = () => {
  emit('search')
}

const clearSearch = () => {
  emit('update:modelValue', '')
}

const searchAgain = () => {
  emit('search-again')
}
</script>

<style scoped>
.search-bar-container {
  background-color: #FFFFFF;
  padding: 8px 16px;
  position: sticky;
  top: 72px;
  z-index: 100;
}

.search-bar {
  max-width: 580px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #D0D0D0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 80px 14px 48px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  outline: none;
}

.search-input::placeholder {
  color: #999;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(78, 175, 217, 0.3);
}

.clear-button {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.clear-button:hover {
  background-color: #f0f0f0;
}

.clear-button svg {
  width: 16px;
  height: 16px;
}

.search-again-button {
  position: absolute;
  right: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
  color: #999;
}

.search-again-button::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background-color: transparent;
  border-radius: 6px;
  transition: background-color 0.2s;
  z-index: -1;
}

.search-again-button:hover::before {
  background-color: #f0f0f0;
}

.search-again-button svg {
  width: 16px;
  height: 16px;
}

@media (min-width: 768px) {
  .search-bar-container {
    padding: 8px 8px 16px;
  }
}
</style>

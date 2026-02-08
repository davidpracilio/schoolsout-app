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
    <button 
      @click="modelValue.trim() && handleSearch()"
      class="search-button"
      :class="{ 'searching': loading }"
      aria-label="Search"
    >
      {{ loading ? 'Searching...' : 'Search' }}
    </button>
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
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasLocation: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'request-location'])

const placeholderTexts = [
  'fun activities for kids around perth',
  'school holiday programs for teenagers in sydney',
  'outdoor drop and leave activities for kids in melbourne',
  'indoor activities for preschoolers in brisbane',
  'family-friendly museums and attractions in canberra',
  'beach activities and water sports for kids on the gold coast',
  'creative workshops and art classes for children in adelaide',
  'nature and wildlife experiences in hobart'
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

const requestLocation = () => {
  emit('request-location')
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

.location-indicator {
  position: absolute;
  right: 40px; /* Position to the left of clear button */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: #ccc; /* Gray when inactive */
  transition: color 0.2s;
  cursor: pointer;
}

.location-indicator:hover {
  color: #666; /* Darker gray on hover */
}

.location-indicator.active {
  color: #4EAFD9; /* Blue when location is available */
}

.location-indicator.active:hover {
  color: #3a9bc7; /* Darker blue on hover */
}

.location-indicator svg {
  width: 16px;
  height: 16px;
}

.search-button {
  display: block;
  margin: 24px auto 0;
  padding: 10px 20px;
  background-color: #4EAFD9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 120px; /* Fixed width to maintain consistent button size */
  text-align: center; /* Center text within fixed width */
}

.search-button.searching {
  background-color: #7BC9E6; /* Lighter blue while searching */
}

.search-button.searching:hover {
  background-color: #5BB8D6; /* Slightly darker hover state for searching button */
}

@media (min-width: 768px) {
  .search-bar-container {
    padding: 8px 8px 16px;
  }
}
</style>

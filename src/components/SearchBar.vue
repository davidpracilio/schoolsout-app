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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const placeholderTexts = [
  'fun activities for kids aged 8-12 for areas around perth, western australia',
  'school holiday programs for teenagers in sydney, new south wales',
  'outdoor adventure activities for kids aged 5-10 in melbourne, victoria',
  'indoor activities for preschoolers during school holidays in brisbane',
  'family-friendly museums and attractions in canberra, act',
  'beach activities and water sports for kids on the gold coast, queensland',
  'creative workshops and art classes for children aged 7-14 in adelaide',
  'nature and wildlife experiences for families in hobart, tasmania'
]

const currentPlaceholder = ref(placeholderTexts[0])
let placeholderIndex = 0
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    placeholderIndex = (placeholderIndex + 1) % placeholderTexts.length
    currentPlaceholder.value = placeholderTexts[placeholderIndex]
  }, 4000)
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
</script>

<style scoped>
.search-bar-container {
  background-color: #FFFFFF;
  padding: 12px 16px;
  position: sticky;
  top: 72px;
  z-index: 100;
}

.search-bar {
  max-width: 600px;
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
  padding: 14px 16px 14px 48px;
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

@media (min-width: 768px) {
  .search-bar-container {
    padding: 8px 8px 16px;
  }
}
</style>

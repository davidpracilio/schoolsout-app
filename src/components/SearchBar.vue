<template>
  <div class="search-bar-container">
    <div class="search-bar-wrapper" ref="searchWrapper">
      <div class="search-bar">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
            stroke="#999" stroke-width="2" stroke-linecap="round"/>
        </svg>
        <input
          ref="searchInput"
          type="text"
          class="search-input"
          :value="modelValue"
          @input="updateValue"
          @keyup.enter="handleSearch"
          @focus="searchFocused = true"
          @blur="searchFocused = false"
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

      <ul
        v-if="searchFocused && !modelValue && recentSearches.length"
        class="recent-dropdown"
        role="listbox"
      >
        <li
          v-for="(item, i) in recentSearches"
          :key="i"
          class="recent-item"
          role="option"
          @mousedown.prevent="selectRecentSearch(item)"
        >
          <svg class="recent-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#999" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          <span class="recent-query">{{ item.query }}</span>
          <span v-if="item.location" class="recent-location">— {{ item.location }}</span>
          <button class="recent-remove" @mousedown.prevent.stop="$emit('remove-recent', i)" aria-label="Remove">×</button>
        </li>
      </ul>
    </div>

    <div class="location-bar-wrapper" ref="locationWrapper">
      <div class="location-bar">
        <svg class="location-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"
            fill="#999"/>
        </svg>
        <input
          ref="locationInput"
          type="text"
          class="location-input"
          :value="locationValue"
          @input="handleLocationInput"
          @keyup.enter="handleSearch"
          @keyup.escape="clearSuggestions"
          placeholder="Where?"
          aria-label="Enter location"
          aria-autocomplete="list"
          autocomplete="off"
        />
        <button
          v-if="locationValue"
          @click="clearLocation"
          class="clear-button"
          aria-label="Clear location"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="#999" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <ul
        v-if="suggestions.length > 0"
        class="autocomplete-dropdown"
        role="listbox"
      >
        <li
          v-for="suggestion in suggestions"
          :key="suggestion.placeId"
          class="autocomplete-item"
          role="option"
          @mousedown.prevent="selectSuggestion(suggestion)"
        >
          {{ suggestion.display }}
        </li>
      </ul>
    </div>

    <button
      @click="loading ? handleCancel() : (modelValue.trim() && handleSearch())"
      class="search-button"
      :class="{ 'searching': loading, 'cancel': loading }"
      aria-label="Search or Cancel"
    >
      {{ loading ? 'Cancel' : 'Search' }}
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLocationAutocomplete } from '../composables/useLocationAutocomplete'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  locationValue: {
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
  recentSearches: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'update:locationValue', 'search', 'cancel', 'select-recent', 'remove-recent'])

const searchInput = ref(null)
const locationInput = ref(null)
const locationWrapper = ref(null)
const searchWrapper = ref(null)
const searchFocused = ref(false)
const currentPlaceholder = ref('What are you looking for?')

const { suggestions, isLoading, search: searchLocation, clear: clearSuggestions } = useLocationAutocomplete()

onMounted(() => {
  if (searchInput.value) {
    searchInput.value.focus()
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  if (locationWrapper.value && !locationWrapper.value.contains(event.target)) {
    clearSuggestions()
  }
  if (searchWrapper.value && !searchWrapper.value.contains(event.target)) {
    searchFocused.value = false
  }
}

const updateValue = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleLocationInput = (event) => {
  const val = event.target.value
  emit('update:locationValue', val)
  searchLocation(val)
}

const selectSuggestion = (suggestion) => {
  emit('update:locationValue', suggestion.display)
  clearSuggestions()
}

const clearSearch = () => {
  emit('update:modelValue', '')
}

const clearLocation = () => {
  emit('update:locationValue', '')
  clearSuggestions()
}

const handleSearch = () => {
  clearSuggestions()
  emit('search')
}

const handleCancel = () => {
  emit('cancel')
}

const selectRecentSearch = (item) => {
  searchFocused.value = false
  emit('select-recent', item)
}
</script>

<style scoped>
.search-bar-container {
  background-color: #FFFFFF;
  padding: 8px 16px 20px;
  position: sticky;
  top: 72px;
  z-index: 100;
}

.search-bar,
.location-bar {
  max-width: 100%;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #D0D0D0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar-wrapper {
  max-width: 580px;
  margin: 0 auto;
  position: relative;
}

.location-bar-wrapper {
  max-width: 580px;
  margin: 8px auto 0;
  position: relative;
}

.location-bar {
  max-width: 100%;
  margin: 0;
}

.search-icon,
.location-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  pointer-events: none;
  flex-shrink: 0;
}

.location-icon {
  width: 18px;
  height: 18px;
}

.search-input,
.location-input {
  width: 100%;
  padding: 14px 80px 14px 48px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  outline: none;
}

.search-input::placeholder,
.location-input::placeholder {
  color: #999;
}

.search-input:focus,
.location-input:focus {
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

.recent-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #D0D0D0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 200;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.15s;
}

.recent-item:hover {
  background-color: #f0f8fd;
}

.recent-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.recent-query {
  font-weight: 500;
}

.recent-location {
  color: #999;
  font-size: 12px;
  flex: 1;
}

.recent-remove {
  margin-left: auto;
  background: none;
  border: none;
  color: #ccc;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 0 2px;
  flex-shrink: 0;
}

.recent-remove:hover {
  color: #999;
}

.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #D0D0D0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  z-index: 200;
}

.autocomplete-item {
  padding: 10px 16px;
  font-size: 15px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.15s;
}

.autocomplete-item:hover {
  background-color: #f0f8fd;
  color: #4EAFD9;
}

.search-button {
  display: block;
  margin: 16px auto 0;
  padding: 10px 20px;
  background-color: #4EAFD9;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 120px;
  text-align: center;
}

.search-button.searching {
  background-color: #7BC9E6;
}

.search-button.searching:hover {
  background-color: #5BB8D6;
}

.search-button.cancel {
  background-color: #F87171;
}

.search-button.cancel:hover {
  background-color: #EF4444;
}

@media (min-width: 768px) {
  .search-bar-container {
    padding: 8px 8px 20px;
  }
}
</style>

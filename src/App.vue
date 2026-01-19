<template>
  <div class="app">
    <LandingPage 
      v-if="showLanding"
      @enter="enterApp"
    />
    <template v-else>
      <AppHeader @go-home="goToLanding" />
      <main class="main-content">
        <SearchBar 
          v-model="searchQuery"
          @search="handleSearch"
        />
        <FilterButtons 
          :activeFilter="activeFilter"
          @filter-change="handleFilterChange"
        />
        <ActivityList 
          :activities="activities"
          @toggle-favorite="handleToggleFavorite"
        />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LandingPage from './components/LandingPage.vue'
import AppHeader from './components/AppHeader.vue'
import SearchBar from './components/SearchBar.vue'
import FilterButtons from './components/FilterButtons.vue'
import ActivityList from './components/ActivityList.vue'

const showLanding = ref(true)
const searchQuery = ref('')
const activeFilter = ref('distance')

// Initialize with landing page state
onMounted(() => {
  // Set initial state if not already set
  if (!window.history.state) {
    window.history.replaceState({ page: 'landing' }, '', '')
  } else if (window.history.state.page === 'app') {
    showLanding.value = false
  }
  
  // Listen for browser back/forward buttons
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

const handlePopState = (event) => {
  if (event.state && event.state.page === 'landing') {
    showLanding.value = true
  } else if (event.state && event.state.page === 'app') {
    showLanding.value = false
  }
}

const enterApp = () => {
  showLanding.value = false
  window.history.pushState({ page: 'app' }, '', '')
}

const goToLanding = () => {
  showLanding.value = true
  window.history.pushState({ page: 'landing' }, '', '')
}

// Sample data - will be replaced with API calls
const activities = ref([
  {
    id: '1',
    name: 'Adventure Playground',
    description: 'Fun slides and swings for all ages.',
    image: new URL('./assets/playground.svg', import.meta.url).href,
    isFavorite: true
  },
  {
    id: '2',
    name: 'Wildlife Park',
    description: 'Meet friendly Australian animals.',
    image: new URL('./assets/animals.svg', import.meta.url).href,
    isFavorite: true
  },
  {
    id: '3',
    name: 'Kids Play Zone',
    description: 'Indoor playground with climbing structures.',
    image: new URL('./assets/playground.svg', import.meta.url).href,
    isFavorite: false
  },
  {
    id: '4',
    name: 'Petting Zoo',
    description: 'Get up close with farm animals.',
    image: new URL('./assets/animals.svg', import.meta.url).href,
    isFavorite: true
  },
  {
    id: '5',
    name: 'Nature Adventure',
    description: 'Explore nature trails and spot wildlife.',
    image: new URL('./assets/animals.svg', import.meta.url).href,
    isFavorite: false
  }
])

const handleSearch = () => {
  console.log('Searching for:', searchQuery.value)
  // TODO: Implement API call to backend
}

const handleFilterChange = (filter) => {
  activeFilter.value = filter
  console.log('Filter changed to:', filter)
  // TODO: Implement sorting/filtering logic
}

const handleToggleFavorite = (activityId) => {
  const activity = activities.value.find(a => a.id === activityId)
  if (activity) {
    activity.isFavorite = !activity.isFavorite
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #FFFFFF;
}

.main-content {
  padding-top: 90px; /* Account for fixed header */
}
</style>

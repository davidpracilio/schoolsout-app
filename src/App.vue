<template>
  <div class="app">
    <LandingPage 
      v-if="showLanding"
      @enter="enterApp"
    />
    <template v-else>
      <AppHeader @go-home="goToLanding" />
      <main class="main-content">
        <div class="page-header">
          <h2 class="intro-title">Search for activities</h2>
          <p class="intro-description">Enter the activity type, location, and age</p>
        </div>
        <SearchBar 
          v-model="searchQuery"
          @search="handleSearch"
        />
        <!-- Temporarily commented out - filter buttons
        <FilterButtons 
          v-if="activities.length > 0"
          :activeFilter="activeFilter"
          @filter-change="handleFilterChange"
        />
        -->
        <ActivityList 
          :activities="activities"
          :loading="loading"
          :has-searched="hasSearched"
          @toggle-favorite="handleToggleFavorite"
          @search-category="handleCategorySearch"
          @clear-search="handleClearSearch"
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
// import FilterButtons from './components/FilterButtons.vue'
import ActivityList from './components/ActivityList.vue'
import { useSearchActivities } from './composables/useSearchActivities'

const showLanding = ref(true)
const searchQuery = ref('')
// const activeFilter = ref('distance')
const isSearching = ref(false)
const hasSearched = ref(false)

const { fetchActivities, loading } = useSearchActivities()

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
    hasSearched.value = false
  } else if (event.state && event.state.page === 'app') {
    showLanding.value = false
    activities.value = []
    searchQuery.value = ''
    hasSearched.value = false
  } else if (event.state && event.state.page === 'app-results') {
    showLanding.value = false
    // Keep the activities and search query from the state
    hasSearched.value = true
  }
}

const enterApp = () => {
  showLanding.value = false
  activities.value = []
  searchQuery.value = ''
  hasSearched.value = false
  window.history.pushState({ page: 'app' }, '', '')
}

const goToLanding = () => {
  showLanding.value = true
  hasSearched.value = false
  window.history.pushState({ page: 'landing' }, '', '')
}

// Sample data - will be replaced with API calls
const activities = ref([])

const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  // Clear existing activities to show skeleton loading
  activities.value = []
  hasSearched.value = true
  isSearching.value = true
  try {
    const results = await fetchActivities(searchQuery.value)
    console.log('API Response:', results)
    
    if (results && results.activities && Array.isArray(results.activities)) {
      activities.value = results.activities.map((activity) => ({
        id: activity.id,
        name: activity.title,
        description: activity.description,
        isFavorite: false,
        // Include additional API data
        category: activity.category,
        location: activity.location,
        ageRange: activity.ageRange,
        date: activity.date,
        price: activity.price,
        bookingUrl: activity.bookingUrl
      }))
      console.log('Updated activities:', activities.value)
      // Push new history state for search results
      if (activities.value.length > 0) {
        window.history.pushState({ page: 'app-results' }, '', '')
      }
    } else {
      console.warn('Unexpected response structure:', results)
    }
  } catch (err) {
    console.error('Search error:', err)
  } finally {
    isSearching.value = false
  }
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

const handleCategorySearch = (query) => {
  searchQuery.value = query
  handleSearch()
}

const handleClearSearch = () => {
  searchQuery.value = ''
  hasSearched.value = false
  activities.value = []
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

.page-header {
  max-width: 600px;
  margin: 0 auto;
  padding: 32px 16px 24px;
  text-align: center;
}

.intro-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.intro-description {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

@media (min-width: 768px) {
  .page-header {
    padding: 20px 16px 20px;
  }

  .intro-title {
    font-size: 28px;
  }
}
</style>

<template>
  <div class="app">
    <LandingPage 
      v-if="showLanding"
      @enter="enterApp"
    />
    <OnboardingCarousel
      v-else-if="showOnboarding"
      :is-open="showOnboarding"
      @complete="completeOnboarding"
    />
    <template v-else>
      <AppHeader @go-home="goToLanding" />
      <main class="main-content">
        <div class="page-header">
          <h2 class="intro-title">What are you looking for and where?</h2>
        </div>
        <SearchBar
          v-model="searchQuery"
          v-model:locationValue="userLocation"
          :has-searched="hasSearched"
          :loading="loading"
          :recent-searches="recentSearches"
          @search="handleSearch"
          @cancel="handleCancelSearch"
          @select-recent="handleSelectRecent"
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
          :current-fact="currentFact"
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
import OnboardingCarousel from './components/OnboardingCarousel.vue'
import AppHeader from './components/AppHeader.vue'
import SearchBar from './components/SearchBar.vue'
// import FilterButtons from './components/FilterButtons.vue'
import ActivityList from './components/ActivityList.vue'
import { useSearchActivities } from './composables/useSearchActivities'
import { useRecentSearches } from './composables/useRecentSearches'

// Onboarding configuration - set to false to always show onboarding, true to show only once
const SHOW_ONBOARDING_ONCE = false

const showLanding = ref(true)
const showOnboarding = ref(false)
const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const userLocation = ref('')

const { fetchActivities, loading, currentFact, cancelSearch } = useSearchActivities()
const { load: loadRecentSearches, save: saveRecentSearch } = useRecentSearches()
const recentSearches = ref([])

// Onboarding cache constants
const ONBOARDING_CACHE_KEY = 'schoolsout_onboarding_seen'

// Helper function to check if user has seen onboarding
const hasSeenOnboarding = () => {
  if (!SHOW_ONBOARDING_ONCE) {
    return false
  }
  try {
    return localStorage.getItem(ONBOARDING_CACHE_KEY) === 'true'
  } catch (error) {
    console.error('Error checking onboarding cache:', error)
    return false
  }
}

// Helper function to mark onboarding as seen
const markOnboardingAsSeen = () => {
  try {
    localStorage.setItem(ONBOARDING_CACHE_KEY, 'true')
    console.log('✅ Onboarding marked as seen')
  } catch (error) {
    console.error('Error saving onboarding cache:', error)
  }
}

// Initialize with landing page state
onMounted(() => {
  if (!window.history.state) {
    window.history.replaceState({ page: 'landing' }, '', '')
  } else if (window.history.state.page === 'app') {
    showLanding.value = false
  }
  window.addEventListener('popstate', handlePopState)
  recentSearches.value = loadRecentSearches()
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
  
  // Show onboarding if user hasn't seen it before
  if (!hasSeenOnboarding()) {
    showOnboarding.value = true
  } else {
    // Skip directly to app if onboarding has been seen
    completeOnboarding()
  }
}

const completeOnboarding = (selectedTagLabels = []) => {
  showOnboarding.value = false
  markOnboardingAsSeen()

  activities.value = []
  searchQuery.value = selectedTagLabels.length ? selectedTagLabels.join(', ') : ''
  hasSearched.value = false
  window.history.pushState({ page: 'app' }, '', '')

  setTimeout(() => {
    const searchInput = document.querySelector('.search-input')
    if (searchInput) {
      searchInput.focus()
    }
  }, 0)
}

const goToLanding = () => {
  showLanding.value = true
  hasSearched.value = false
  window.history.pushState({ page: 'landing' }, '', '')
}

// Sample data - will be replaced with API calls
const activities = ref([])

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    console.log('Search query is empty, skipping search')
    return
  }
  
  console.log('Starting search for:', searchQuery.value)
  console.log('User location at search time:', userLocation.value)
  
  // Clear existing activities to show skeleton loading
  activities.value = []
  hasSearched.value = true
  isSearching.value = true
  saveRecentSearch(searchQuery.value, userLocation.value)
  recentSearches.value = loadRecentSearches()
  try {
    const results = await fetchActivities(searchQuery.value, userLocation.value)
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
        bookingUrl: activity.bookingUrl,
        // Tags from backend API - now available in the tags key
        // Backend returns tags as an array of tag IDs (e.g., ["school_kids", "indoor"])
        tags: activity.tags || []
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
  userLocation.value = ''
  hasSearched.value = false
  activities.value = []
}

const handleSelectRecent = ({ query, location }) => {
  searchQuery.value = query
  userLocation.value = location
  handleSearch()
}

const handleCancelSearch = () => {
  cancelSearch()
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
  padding: 24px 16px 16px;
  text-align: center;
}

.intro-title {
  font-size: 20px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 0;
}

@media (min-width: 768px) {
  .page-header {
    padding: 16px 16px 16px;
  }

  .intro-title {
    font-size: 22px;
  }
}
</style>

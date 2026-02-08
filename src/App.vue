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
          <p class="intro-description">Enter an activity type and a location to begin</p>
        </div>
        <SearchBar 
          v-model="searchQuery"
          :has-searched="hasSearched"
          :loading="loading"
          :has-location="!!userLocation"
          @search="handleSearch"
          @request-location="requestUserLocation"
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
const userLocation = ref(null)

const { fetchActivities, loading, currentFact } = useSearchActivities()

// Location caching constants
const LOCATION_CACHE_KEY = 'schoolsout_user_location'
const LOCATION_CACHE_DURATION = 10 * 60 * 1000 // 10 minutes in milliseconds

// Helper function to get cached location
const getCachedLocation = () => {
  try {
    const cached = localStorage.getItem(LOCATION_CACHE_KEY)
    if (cached) {
      const { location, timestamp } = JSON.parse(cached)
      const now = Date.now()
      // Check if cache is still valid
      if (now - timestamp < LOCATION_CACHE_DURATION) {
        console.log('✅ Using cached location:', location)
        return location
      } else {
        // Cache expired, remove it
        localStorage.removeItem(LOCATION_CACHE_KEY)
      }
    }
  } catch (error) {
    console.error('Error reading location cache:', error)
  }
  return null
}

// Helper function to save location to cache
const cacheLocation = (location) => {
  try {
    localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
      location,
      timestamp: Date.now()
    }))
    console.log('💾 Location cached:', location)
  } catch (error) {
    console.error('Error caching location:', error)
  }
}

// Helper function to reverse geocode coordinates to get suburb/city
const reverseGeocode = async (latitude, longitude) => {
  try {
    // Using OpenStreetMap's Nominatim API (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('🗺️ Reverse geocoding response:', data)
    
    // Extract suburb/city from the response
    // Nominatim returns address with various levels: suburb, city, town, village, etc.
    const address = data.address || {}
    const suburb = address.suburb || address.town || address.village || address.city || 'Unknown Location'
    const state = address.state || ''
    
    return { suburb, state }
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error)
    return { suburb: 'Current Location', state: '' }
  }
}

// Initialize with landing page state
onMounted(() => {
  // Set initial state if not already set
  if (!window.history.state) {
    window.history.replaceState({ page: 'landing' }, '', '')
  } else if (window.history.state.page === 'app') {
    showLanding.value = false
  }
  
  // Don't request location on mount - let user click the button if they want it
  // This avoids permission prompts and timeouts on page load
  
  // Listen for browser back/forward buttons
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

const requestUserLocation = async () => {
  console.log('Requesting user location...')
  
  // Check for cached location first
  const cachedLocation = getCachedLocation()
  if (cachedLocation) {
    userLocation.value = cachedLocation
    return
  }
  
  if (navigator.geolocation) {
    console.log('Geolocation API available, requesting position...')
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        console.log('✅ Geolocation SUCCESS - Location obtained:', latitude, longitude)
        
        // Perform reverse geocoding to get suburb/city name
        const { suburb, state } = await reverseGeocode(latitude, longitude)
        
        const newLocation = { lat: latitude, lon: longitude, city: suburb, state }
        userLocation.value = newLocation
        
        // Cache the location for future use
        cacheLocation(newLocation)
        console.log('✅ Location obtained:', latitude, longitude, 'Suburb:', suburb)
      },
      (error) => {
        const errorInfo = {
          code: error.code,
          message: error.message,
          codeMeaning: {
            1: 'PERMISSION_DENIED',
            2: 'POSITION_UNAVAILABLE', 
            3: 'TIMEOUT'
          }[error.code] || 'UNKNOWN'
        }
        
        if (error.code === 3) {
          // Timeout - log as warning since this is common when user hasn't granted permission yet
          console.warn('⚠️ Geolocation TIMEOUT - User may need to grant permission or location services may be slow.', errorInfo)
          // Try to use cached location as fallback
          const fallbackLocation = getCachedLocation()
          if (fallbackLocation) {
            console.log('⚠️ Using cached location as fallback after timeout')
            userLocation.value = fallbackLocation
          }
        } else {
          console.error('❌ Geolocation ERROR:', errorInfo)
        }
        userLocation.value = null
      },
      {
        enableHighAccuracy: false,
        timeout: 15000, // 15 second timeout for geolocation API (increased for better reliability)
        maximumAge: 600000 // Accept cached position up to 10 minutes old
      }
    )
  } else {
    console.log('❌ Geolocation API not available in this browser')
    userLocation.value = null
  }
}

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

  // Request user location
  requestUserLocation()
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
  color: #2c3e50;
  margin-bottom: 12px;
}

.intro-description {
  font-size: 16px;
  color: #555;
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

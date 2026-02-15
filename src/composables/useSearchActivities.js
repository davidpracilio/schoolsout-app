import { ref } from 'vue'
import { searchFacts } from '../data/searchFacts.js'

const API_ENDPOINT = 'https://searchactivities-27dbbqr3ga-uc.a.run.app'
// const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes - temporarily disabled
const DEBOUNCE_DELAY = 500 // milliseconds
const MAX_RETRIES = 3

// const cache = new Map() // temporarily disabled

export function useSearchActivities() {
  const loading = ref(false)
  const error = ref(null)
  const currentFact = ref('')
  let debounceTimer = null
  let factInterval = null
  let abortController = null


  // const getCached = (query) => {
  //   const cached = cache.get(query)
  //   if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
  //     return cached.data
  //   }
  //   return null
  // }

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * searchFacts.length)
    return searchFacts[randomIndex]
  }

  const startFactCycling = () => {
    // Clear any existing interval
    if (factInterval) {
      clearInterval(factInterval)
    }
    
    // Set initial fact
    currentFact.value = getRandomFact()
    
    // Start cycling every 3 seconds
    factInterval = setInterval(() => {
      currentFact.value = getRandomFact()
    }, 6000)
  }

  const stopFactCycling = () => {
    if (factInterval) {
      clearInterval(factInterval)
      factInterval = null
    }
    currentFact.value = ''
  }

  const fetchActivities = async (query, location = null) => {
    if (!query || query.trim().length === 0) {
      return null
    }

    // Create a unique cache key that includes location if provided
    // const cacheKey = location ? `${query}|${location.city},${location.state}` : query

    // Check cache first - temporarily disabled
    // const cached = getCached(cacheKey)
    // if (cached) {
    //   console.log('Returning cached results for:', cacheKey)
    //   return cached
    // }

    loading.value = true
    error.value = null
    startFactCycling()

    // Create a new AbortController for this search
    abortController = new AbortController()

    try {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`Fetching from API (attempt ${attempt}):`, API_ENDPOINT)
          console.log('Query:', query)
          if (location) {
            console.log('Location context:', location)
          }
          
          const requestBody = { query: query.trim() }
          
          // Check if query contains location indicators (simpler approach)
          const queryLower = query.toLowerCase()
          const locationIndicators = /\b(in|near|at|around|close to|nearby|within|located in|based in|from)\s+/i
          const hasLocationInQuery = locationIndicators.test(queryLower)
          
          if (location && location.city && !hasLocationInQuery) {
            // Use the suburb/city from reverse geocoding
            const locationString = location.state 
              ? `${location.city}, ${location.state}` 
              : location.city
            requestBody.location = locationString
            console.log('Adding location to search:', locationString)
          }

          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: abortController.signal
          })

          console.log('Response status:', response.status)

          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
          }

          const data = await response.json()
          console.log('API data received:', data)
          
          // Only cache and return if activities are present - caching temporarily disabled
          if (data && data.activities && Array.isArray(data.activities) && data.activities.length > 0) {
            // setCached(cacheKey, data)
            return data
          } else {
            // No activities returned - return empty result instead of throwing error
            console.log('No activities returned from API for query:', query)
            return { activities: [] }
          }
        } catch (err) {
          // Check if error is due to abort
          if (err.name === 'AbortError') {
            console.log('Search cancelled by user')
            return null
          }
          console.error(`Search API error (attempt ${attempt}):`, err)
          if (attempt === MAX_RETRIES) {
            error.value = err.message
            return null
          }
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
        }
      }
    } finally {
      loading.value = false
      stopFactCycling()
    }
  }

  const cancelSearch = () => {
    console.log('Cancelling search...')
    if (abortController) {
      abortController.abort()
    }
    loading.value = false
    stopFactCycling()
    if (debounceTimer) {
      clearTimeout(debounceTimer)
      debounceTimer = null
    }
  }

  const debouncedSearch = (query, callback, location = null) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (!query || query.trim().length === 0) {
      callback(null)
      return
    }

    debounceTimer = setTimeout(async () => {
      const result = await fetchActivities(query, location)
      callback(result)
    }, DEBOUNCE_DELAY)
  }

  return {
    loading,
    error,
    currentFact,
    fetchActivities,
    debouncedSearch,
    cancelSearch
  }
}

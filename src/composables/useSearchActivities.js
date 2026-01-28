import { ref } from 'vue'

const API_ENDPOINT = 'https://searchactivities-27dbbqr3ga-uc.a.run.app'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const DEBOUNCE_DELAY = 500 // milliseconds

const cache = new Map()

export function useSearchActivities() {
  const loading = ref(false)
  const error = ref(null)
  let debounceTimer = null

  const getCached = (query) => {
    const cached = cache.get(query)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }
    return null
  }

  const setCached = (query, data) => {
    cache.set(query, { data, timestamp: Date.now() })
  }

  const fetchActivities = async (query) => {
    if (!query || query.trim().length === 0) {
      return null
    }

    // Check cache first
    const cached = getCached(query)
    if (cached) {
      console.log('Returning cached results for:', query)
      return cached
    }

    loading.value = true
    error.value = null

    try {
      console.log('Fetching from API:', API_ENDPOINT)
      console.log('Query:', query)
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query: query.trim() })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('API data received:', data)
      
      setCached(query, data)
      return data
    } catch (err) {
      error.value = err.message
      console.error('Search API error:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const debouncedSearch = (query, callback) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (!query || query.trim().length === 0) {
      callback(null)
      return
    }

    debounceTimer = setTimeout(async () => {
      const result = await fetchActivities(query)
      callback(result)
    }, DEBOUNCE_DELAY)
  }

  return {
    loading,
    error,
    fetchActivities,
    debouncedSearch
  }
}

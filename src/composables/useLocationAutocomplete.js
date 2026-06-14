import { ref } from 'vue'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const DEBOUNCE_DELAY = 300
const MIN_QUERY_LENGTH = 2

export function useLocationAutocomplete() {
  const suggestions = ref([])
  const isLoading = ref(false)
  let debounceTimer = null
  let abortController = null

  const formatSuggestion = (result) => {
    const addr = result.address || {}
    const parts = [
      addr.suburb || addr.town || addr.village || addr.city || addr.municipality || result.name,
      addr.state || addr.county,
      addr.country
    ].filter(Boolean)
    return parts.join(', ')
  }

  const search = (query) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!query || query.length < MIN_QUERY_LENGTH) {
      suggestions.value = []
      return
    }

    debounceTimer = setTimeout(async () => {
      if (abortController) abortController.abort()
      abortController = new AbortController()
      isLoading.value = true

      try {
        const params = new URLSearchParams({
          q: query,
          format: 'json',
          limit: '5',
          addressdetails: '1',
          countrycodes: 'au'
        })
        const response = await fetch(`${NOMINATIM_URL}?${params}`, {
          signal: abortController.signal,
          headers: { 'User-Agent': 'SchoolsOutApp/1.0' }
        })
        if (!response.ok) throw new Error(`Nominatim error: ${response.status}`)
        const results = await response.json()
        suggestions.value = results.map((r) => ({
          display: formatSuggestion(r),
          placeId: r.place_id
        }))
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Location autocomplete error:', err)
          suggestions.value = []
        }
      } finally {
        isLoading.value = false
      }
    }, DEBOUNCE_DELAY)
  }

  const clear = () => {
    suggestions.value = []
    if (debounceTimer) clearTimeout(debounceTimer)
    if (abortController) abortController.abort()
  }

  return { suggestions, isLoading, search, clear }
}

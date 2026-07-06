import { ref } from 'vue'

const PHOTON_URL = 'https://photon.komoot.io/api/'
// Rough Australia bounding box (minLon,minLat,maxLon,maxLat) — Photon has no
// country filter param, so this is used to keep results in-region and let
// Australian suburbs outrank same-named places overseas (e.g. Richmond, VA).
const AU_BBOX = '112.0,-44.0,154.0,-10.0'
const DEBOUNCE_DELAY = 300
const MIN_QUERY_LENGTH = 2
const CACHE_MAX_SIZE = 100

export function useLocationAutocomplete() {
  const suggestions = ref([])
  const isLoading = ref(false)
  let debounceTimer = null
  let abortController = null
  const cache = new Map()

  const cacheSet = (key, value) => {
    if (cache.size >= CACHE_MAX_SIZE) {
      cache.delete(cache.keys().next().value)
    }
    cache.set(key, value)
  }

  const formatSuggestion = (props) => {
    const isPostcode = props.osm_value === 'postcode'
    const parts = [
      isPostcode ? props.district : props.name,
      props.state
    ].filter(Boolean)
    return parts.join(', ')
  }

  const search = (query) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (!query || query.length < MIN_QUERY_LENGTH) {
      suggestions.value = []
      return
    }

    const cacheKey = query.trim().toLowerCase()
    if (cache.has(cacheKey)) {
      suggestions.value = cache.get(cacheKey)
      return
    }

    debounceTimer = setTimeout(async () => {
      if (abortController) abortController.abort()
      abortController = new AbortController()
      isLoading.value = true

      try {
        const params = new URLSearchParams({
          q: query,
          limit: '15',
          lang: 'en',
          bbox: AU_BBOX
        })
        const response = await fetch(`${PHOTON_URL}?${params}`, {
          signal: abortController.signal
        })
        if (!response.ok) throw new Error(`Photon error: ${response.status}`)
        const { features } = await response.json()
        const seen = new Set()
        const results = features.reduce((acc, { properties: p }) => {
          if (p.countrycode !== 'AU' || p.osm_key !== 'place') return acc
          const display = formatSuggestion(p)
          if (!display || seen.has(display)) return acc
          seen.add(display)
          acc.push({ display, placeId: p.osm_id })
          return acc
        }, []).slice(0, 5)
        cacheSet(cacheKey, results)
        suggestions.value = results
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

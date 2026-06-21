const STORAGE_KEY = 'schoolsout_recent_searches'
const MAX_SEARCHES = 5

export function useRecentSearches() {
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  const save = (query, location) => {
    if (!query.trim()) return
    const existing = load().filter(
      s => !(s.query === query && s.location === location)
    )
    existing.unshift({ query, location })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, MAX_SEARCHES)))
    } catch {}
  }

  const remove = (index) => {
    const searches = load()
    searches.splice(index, 1)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches))
    } catch {}
  }

  return { load, save, remove }
}

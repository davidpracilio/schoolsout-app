const STORAGE_KEY = 'schoolsout_saved_activities'

export function useSavedActivities() {
  const load = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  }

  const save = (activity) => {
    const existing = load().filter(a => a.id !== activity.id)
    existing.unshift({ ...activity, isFavorite: true })
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    } catch {}
  }

  const remove = (id) => {
    const existing = load().filter(a => a.id !== id)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
    } catch {}
  }

  const isSaved = (id) => load().some(a => a.id === id)

  return { load, save, remove, isSaved }
}

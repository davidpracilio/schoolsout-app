import { reactive } from 'vue'

const STORAGE_KEY = 'schoolsout_seen_hints'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

const seen = reactive(load())

export function useHints() {
  const isSeen = (id) => seen.includes(id)

  const markSeen = (id) => {
    if (seen.includes(id)) return
    seen.push(id)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seen))
    } catch {}
  }

  return { isSeen, markSeen }
}

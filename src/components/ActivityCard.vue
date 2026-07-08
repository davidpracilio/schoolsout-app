<template>
  <div class="activity-card" ref="cardEl" @click="handleCardClick">
    <div class="card-content">
      <div class="card-main">
        <h3 class="card-title">{{ activity.name }}</h3>
        <p class="card-description">{{ activity.description }}</p>
        <hr class="card-divider">

        <span class="location-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4EAFD9"/>
          </svg>
          <span class="meta-text">{{ getLocationDisplay() }}</span>
        </span>

        <div class="card-meta">
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#9B59B6"/>
            </svg>
            <span class="meta-text">{{ (activity.ageRange && !activity.ageRange.includes('Not available')) ? activity.ageRange : 'Check the website' }}</span>
          </span>
          <span class="meta-item">
            <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="#27AE60"/>
            </svg>
            <span class="meta-text">{{ (activity.price && !activity.price.includes('Not available') && !activity.price.includes('Not specified')) ? activity.price : 'Check the website' }}</span>
          </span>
        </div>

        <!-- Tags + actions row -->
        <div class="tags-row">
          <div class="card-actions">
            <button
              class="favorite-button"
              :class="{ active: activity.isFavorite }"
              @click.stop="$emit('toggle-favorite')"
              :aria-label="activity.isFavorite ? 'Remove from saved' : 'Save activity'"
              :data-tooltip="activity.isFavorite ? 'Remove' : 'Save'"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  :fill="activity.isFavorite ? '#F87171' : 'none'"
                  :stroke="activity.isFavorite ? '#F87171' : '#ccc'"
                  stroke-width="1.5"
                />
              </svg>
            </button>
            <button
              v-if="canShare"
              class="share-button"
              @click.stop="handleShare"
              aria-label="Share activity"
              data-tooltip="Share"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"
                  stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <button
              v-if="showCalendar"
              class="calendar-button"
              @click.stop="handleAddToCalendar"
              aria-label="Add to calendar"
              data-tooltip="Calendar"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="#ccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="16" y1="2" x2="16" y2="6" stroke="#ccc" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="8" y1="2" x2="8" y2="6" stroke="#ccc" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#ccc" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div v-if="allTagObjects.length > 0" class="tags-container">
            <HintBubble
              v-if="showTagsHint && hintInView"
              hint-id="activity-tags-hint"
              text="Tags highlight key attributes about an activity, like age range or environment."
              placement="bottom"
            />
            <button
              v-if="extraTags.length > 0"
              type="button"
              class="tag-count-badge"
              :aria-expanded="tagsExpanded"
              :aria-label="tagsExpanded ? 'Show fewer tags' : `Show ${extraTags.length} more tags`"
              @click.stop="tagsExpanded = !tagsExpanded"
            >
              <svg v-if="tagsExpanded" class="tag-count-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 15l6-6 6 6" stroke="#666666" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-else>+{{ extraTags.length }}</span>
            </button>
            <span v-for="tag in primaryTags" :key="tag.id" class="tag" :title="tag.description">
              <span class="tag-emoji">{{ tag.emoji }}</span>
              <span class="tag-label">{{ tag.label }}</span>
            </span>
          </div>

          <div v-if="extraTags.length > 0" class="tags-expand" :class="{ 'is-expanded': tagsExpanded }">
            <div class="tags-expand-inner">
              <span v-for="tag in extraTags" :key="tag.id" class="tag" :title="tag.description">
                <span class="tag-emoji">{{ tag.emoji }}</span>
                <span class="tag-label">{{ tag.label }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <HintBubble
      v-if="showSaveHint && hintInView"
      hint-id="save-activity-hint"
      text="Tap the heart to save an activity for later."
      placement="bottom-left"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { formatTagsForDisplay } from '../data/activityTags.js'
import HintBubble from './HintBubble.vue'

const { activity, showCalendar, showSaveHint, showTagsHint } = defineProps({
  activity: {
    type: Object,
    required: true
  },
  showCalendar: {
    type: Boolean,
    default: false
  },
  showSaveHint: {
    type: Boolean,
    default: false
  },
  showTagsHint: {
    type: Boolean,
    default: false
  }
})

const cardEl = ref(null)
const hintInView = ref(false)
let hintObserver = null

onMounted(() => {
  if ((!showSaveHint && !showTagsHint) || !cardEl.value) return
  hintObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        hintInView.value = true
        hintObserver.disconnect()
      }
    },
    { threshold: 0.6 }
  )
  hintObserver.observe(cardEl.value)
})

onUnmounted(() => {
  hintObserver?.disconnect()
})

defineEmits(['toggle-favorite', 'click'])

const canShare = computed(() => !!navigator.share)

const handleShare = async () => {
  const url = activity.bookingUrl &&
    !activity.bookingUrl.includes('example.com') &&
    !activity.bookingUrl.includes('Not available') &&
    activity.bookingUrl.trim() !== ''
    ? activity.bookingUrl
    : `https://www.google.com/search?q=${encodeURIComponent(activity.name)}`

  try {
    await navigator.share({
      title: activity.name,
      text: activity.description,
      url
    })
  } catch (err) {
    if (err.name !== 'AbortError') console.error('Share failed:', err)
  }
}

const MAX_VISIBLE_TAGS = 4

const tagsExpanded = ref(false)

// Tags from backend are tag IDs (strings like "school_kids", "indoor")
// formatTagsForDisplay expects an array of tag IDs and returns tag objects
const allTagObjects = computed(() => formatTagsForDisplay(activity.tags, Infinity))
const primaryTags = computed(() => allTagObjects.value.slice(0, MAX_VISIBLE_TAGS))
const extraTags = computed(() => allTagObjects.value.slice(MAX_VISIBLE_TAGS))

const getLocationDisplay = () => {
  if (!activity.location) {
    return 'Check the website'
  }
  
  // Check if location contains "Not specified" text
  if (activity.location.includes('Not specified')) {
    return 'Check the website'
  }
  
  // Check if location contains "Not available"
  if (activity.location.includes('Not available')) {
    return 'Check the website'
  }
  
  return activity.location
}

const handleAddToCalendar = () => {
  const today = new Date()
  const pad = n => String(n).padStart(2, '0')
  const fmt = d => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const isValid = val => val && !val.includes('Not') && val.trim() !== ''

  const description = [
    activity.description,
    isValid(activity.price) ? `Cost: ${activity.price}` : null,
    isValid(activity.date) ? `When: ${activity.date}` : null,
    isValid(activity.bookingUrl) && !activity.bookingUrl.includes('example.com')
      ? `More info: ${activity.bookingUrl}`
      : null,
  ].filter(Boolean).join('\\n\\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `DTSTART;VALUE=DATE:${fmt(today)}`,
    `DTEND;VALUE=DATE:${fmt(tomorrow)}`,
    `SUMMARY:${activity.name}`,
    `DESCRIPTION:${description}`,
    isValid(activity.location) ? `LOCATION:${activity.location}` : null,
    isValid(activity.bookingUrl) && !activity.bookingUrl.includes('example.com')
      ? `URL:${activity.bookingUrl}`
      : null,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  const filename = `${activity.name.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'activity'}.ics`

  // TODO: test calendar handoff on Android, iOS, and desktop — no download attribute so MIME type drives behavior
  const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' })
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(blobUrl)
}

const handleCardClick = () => {
  let url;
  
  // Check if bookingUrl exists and is valid (not a placeholder)
  if (activity.bookingUrl && 
      !activity.bookingUrl.includes('example.com') && 
      !activity.bookingUrl.includes('Not available') &&
      !activity.bookingUrl.includes('Not%20Available') &&
      !activity.bookingUrl.includes('Not directly available') &&
      activity.bookingUrl.trim() !== '') {
    url = activity.bookingUrl;
  } else {
    // Fall back to Google search using activity name
    // This handles cases where bookingUrl is missing, null, undefined, or invalid
    url = `https://www.google.com/search?q=${encodeURIComponent(activity.name)}`;
  }
  
  window.open(url, '_blank');
};
</script>

<style scoped>
.activity-card {
  background-color: #FFFFFF;
  border: 1px solid #D0D0D0;
  border-radius: 12px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: border-color 0.2s;
  position: relative;
  cursor: pointer;
}

.activity-card:hover {
  border-color: #A0A0A0;
  background-color: #fafafa;
}

.card-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.card-description {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.card-divider {
  border: none;
  border-top: 1px solid #E0E0E0;
  margin: 8px 0 12px 0;
}
.location-item {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}
.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  max-width: 100%;
}

.card-meta .meta-item:first-child {
  display: none; /* Temporarily hide age metadata */
}

.meta-item {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  font-size: 12px;
  color: #666;
  line-height: 1;
}

.meta-text {
  line-height: 1.2;
}

.meta-item a {
  color: #4EAFD9;
  text-decoration: none;
  font-weight: 600;
}

.meta-item a:hover {
  text-decoration: underline;
}

.meta-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.tags-row {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #E0E0E0;
}

.card-actions {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  align-items: center;
  gap: 0;
}

.favorite-button,
.calendar-button,
.share-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
  border-radius: 50%;
  position: relative;
}

@media (hover: hover) {
  [data-tooltip]::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: calc(100% + 6px);
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.72);
    color: #fff;
    font-size: 11px;
    padding: 4px 8px;
    border-radius: 4px;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s;
    z-index: 10;
  }

  [data-tooltip]:hover::after {
    opacity: 1;
  }
}

.favorite-button:hover,
.calendar-button:hover,
.share-button:hover {
  transform: scale(1.15);
  background-color: #fef2f2;
}

.favorite-button:active,
.calendar-button:active,
.share-button:active {
  transform: scale(0.95);
}

.favorite-button svg,
.calendar-button svg,
.share-button svg {
  width: 22px;
  height: 22px;
}

.visit-button {
  position: absolute;
  bottom: 12px;
  right: 20px;
  padding: 6px 12px;
  background-color: #4EAFD9;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.visit-button:hover {
  background-color: #3a8fb8;
}

/* Tags Container and Styling */
.tags-container {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: flex-end;
  min-width: 0;
  position: relative;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background-color: #f5a578;
  color: #FFFFFF;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  flex: 0 1 68px;
  min-width: 32px;
  justify-content: center;
}

.tag-emoji {
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
}

.tag-label {
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.tag-count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 20px;
  padding: 0;
  border: none;
  border-radius: 999px;
  background-color: #E4E4E4;
  color: #666666;
  font-size: 11px;
  font-weight: 600;
  font-family: inherit;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
}

.tag-count-badge:hover {
  background-color: #d5d5d5;
}

.tag-count-icon {
  width: 12px;
  height: 12px;
}

.tags-expand {
  grid-column: 2;
  grid-row: 2;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
}

.tags-expand.is-expanded {
  grid-template-rows: 1fr;
}

.tags-expand-inner {
  min-height: 0;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.tags-expand.is-expanded .tags-expand-inner {
  padding-top: 8px;
  opacity: 1;
}

@media (min-width: 768px) {
  .activity-card {
    padding: 14px;
  }
  
  .card-icon {
    width: 52px;
    height: 52px;
  }
  
  .card-icon svg {
    width: 29px;
    height: 29px;
  }
  
  .card-title {
    font-size: 17px;
  }
  
  .card-description {
    font-size: 14px;
  }
}
</style>

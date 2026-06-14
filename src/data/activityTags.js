/**
 * Activity Tags Configuration
 * Defines all available tags for activities organized by category
 */

export const TAG_CATEGORIES = {
  AGE_GROUP: 'ageGroup',
  FACILITIES: 'facilities',
  ENVIRONMENT: 'environment'
}

export const ACTIVITY_TAGS = {
  // Age Group Tags
  BABY_INFANT: {
    id: 'baby_infant',
    emoji: '👶',
    label: 'Baby/Infant',
    category: TAG_CATEGORIES.AGE_GROUP,
    description: 'Best for sensory play, pram-friendly walks'
  },
  TODDLER: {
    id: 'toddler',
    emoji: '🍼',
    label: 'Toddler',
    category: TAG_CATEGORIES.AGE_GROUP,
    description: 'Best for fenced-in parks, soft play'
  },
  PRESCHOOLER: {
    id: 'preschooler',
    emoji: '🎈',
    label: 'Preschooler',
    category: TAG_CATEGORIES.AGE_GROUP,
    description: 'Best for ages 3–5, interactive but simple'
  },
  SCHOOL_KIDS: {
    id: 'school_kids',
    emoji: '🎒',
    label: 'School Kids',
    category: TAG_CATEGORIES.AGE_GROUP,
    description: 'Best for primary school ages, more active/complex'
  },
  TEENS_BIG_KIDS: {
    id: 'teens_big_kids',
    emoji: '🛹',
    label: 'Teens/Big Kids',
    category: TAG_CATEGORIES.AGE_GROUP,
    description: 'Best for high-energy or "cool" activities'
  },
  ALL_AGES: {
    id: 'all_ages',
    emoji: '🎉',
    label: 'All Ages',
    category: TAG_CATEGORIES.AGE_GROUP,
    description: 'The "Family Favorite" tag'
  },

  // Facility & Logistics Tags
  TOILETS: {
    id: 'toilets',
    emoji: '🚻',
    label: 'Toilets',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'The #1 most requested info'
  },
  BABY_CHANGE: {
    id: 'baby_change',
    emoji: '🍼',
    label: 'Baby Change',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'Specifically for diaper tables'
  },
  CAFE_COFFEE: {
    id: 'cafe_coffee',
    emoji: '☕',
    label: 'Cafe/Coffee',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'Essential for parent survival'
  },
  PICNIC_AREA: {
    id: 'picnic_area',
    emoji: '🧺',
    label: 'Picnic Area',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'Great for budget-conscious families'
  },
  EASY_PARKING: {
    id: 'easy_parking',
    emoji: '🚗',
    label: 'Easy Parking',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'Convenient parking available'
  },
  ACCESSIBLE: {
    id: 'accessible',
    emoji: '♿',
    label: 'Accessible',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'For prams, strollers, and wheelchairs'
  },
  FREE_WIFI: {
    id: 'free_wifi',
    emoji: '📶',
    label: 'Free Wi-Fi',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'Useful for parents who might need to catch up on work'
  },
  FENCED_IN: {
    id: 'fenced_in',
    emoji: '🛡️',
    label: 'Fenced-in',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'The "Safety First" tag for runners'
  },
  GRIP_SOCKS: {
    id: 'grip_socks',
    emoji: '👟',
    label: 'Grip Socks',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'Specifically for trampoline or play centers'
  },

  // Environment & Vibe Tags
  OUTDOOR: {
    id: 'outdoor',
    emoji: '🌳',
    label: 'Outdoor',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'Fresh air and sunshine'
  },
  INDOOR: {
    id: 'indoor',
    emoji: '🏠',
    label: 'Indoor',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'The "Rainy Day" savior'
  },
  AIR_CON: {
    id: 'air_con',
    emoji: '❄️',
    label: 'Air Con',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'Crucial for summer holidays'
  },
  SHADED: {
    id: 'shaded',
    emoji: '☀️',
    label: 'Shaded',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'Important for UV protection at parks'
  },
  QUIET_ZONE: {
    id: 'quiet_zone',
    emoji: '🤫',
    label: 'Quiet Zone',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'For neurodivergent kids or those needing a sensory break'
  },
  HIGH_ENERGY: {
    id: 'high_energy',
    emoji: '⚡',
    label: 'High Energy',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'To burn off steam'
  },
  WATER_ACTIVITY: {
    id: 'water_activity',
    emoji: '💧',
    label: 'Water Activity',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'Splash pads, pools, water play areas'
  },
  SPORTS: {
    id: 'sports',
    emoji: '🏅',
    label: 'Sports',
    category: TAG_CATEGORIES.ENVIRONMENT,
    description: 'Organised sports, athletics, team activities'
  },
  DROP_AND_LEAVE: {
    id: 'drop_and_leave',
    emoji: '🚪',
    label: 'Drop & Leave',
    category: TAG_CATEGORIES.FACILITIES,
    description: 'Drop-off childcare available'
  }
}

/**
 * Get tag object by ID
 * @param {string} tagId - The tag ID
 * @returns {Object|null} The tag object or null if not found
 */
export function getTagById(tagId) {
  return Object.values(ACTIVITY_TAGS).find(tag => tag.id === tagId) || null
}

/**
 * Get all tags in a specific category
 * @param {string} category - The category (AGE_GROUP, FACILITIES, ENVIRONMENT)
 * @returns {Array} Array of tag objects in that category
 */
export function getTagsByCategory(category) {
  return Object.values(ACTIVITY_TAGS).filter(tag => tag.category === category)
}

/**
 * Format tags for display
 * @param {Array} tagIds - Array of tag IDs
 * @param {number} limit - Maximum number of tags to display (default: 4)
 * @returns {Array} Array of formatted tag objects
 */
export function formatTagsForDisplay(tagIds, limit = 4) {
  if (!Array.isArray(tagIds)) {
    return []
  }

  return tagIds
    .slice(0, limit)
    .map(tagId => getTagById(tagId))
    .filter(tag => tag !== null)
}

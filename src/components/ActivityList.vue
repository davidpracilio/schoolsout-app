<template>
  <div class="activity-list">
    <!-- Empty State -->
    <div v-if="activities.length === 0 && !loading" class="intro-section">
      <!-- No search performed yet - show welcome content -->
      <div v-if="!hasSearched" class="welcome-state">
        <!-- Temporarily commented out - intro icon
        <div class="intro-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="#4EAFD9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#4EAFD9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        -->
        <!-- Temporarily commented out - welcome content
        <h2 class="intro-title">Find fun activities nearby</h2>
        <p class="intro-description">
          Search for activities or explore popular categories below
        </p>
        
        <!-- Temporarily commented out - category section
        <div class="category-grid">
          <button 
            v-for="category in categories" 
            :key="category.name"
            class="category-button"
            @click="$emit('search-category', category.query)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </button>
        </div>
        -->
        
        <!-- Temporarily commented out - search examples
        <div class="search-examples">
          <p class="examples-label">Or try searching for:</p>
          <div class="examples-list">
            <button 
              v-for="example in searchExamples" 
              :key="example"
              class="example-chip"
              @click="$emit('search-category', example)"
            >
              {{ example }}
            </button>
          </div>
        </div>
        -->
      </div>
      
      <!-- Search performed but no results found -->
      <div v-else class="no-results-state">
        <div class="no-results-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.978-5.5-2.5M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" stroke="#6B7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2 class="no-results-title">No activities found</h2>
        <p class="no-results-description">
          We couldn't find any activities matching your search. Try adjusting your search terms or location.
        </p>
        <button class="try-again-button" @click="$emit('clear-search')">
          Try a different search
        </button>
      </div>
    </div>
    
    <!-- Search Fact -->
    <div v-if="loading && activities.length === 0 && currentFact" class="search-fact">
      <div class="fact-content">
        <span class="fact-icon">💡</span>
        <p class="fact-text">{{ currentFact }}</p>
      </div>
    </div>
    
    <!-- Loading Skeleton -->
    <div v-if="loading && activities.length === 0" class="loading-skeleton">
      <div v-for="n in 6" :key="n" class="skeleton-card">
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-description"></div>
          <div class="skeleton-meta">
            <div class="skeleton-meta-row">
              <div class="skeleton-meta-item"></div>
            </div>
            <div class="skeleton-meta-row">
              <div class="skeleton-meta-item short"></div>
              <div class="skeleton-meta-item short"></div>
            </div>
          </div>
        </div>
        <div class="skeleton-favorite"></div>
      </div>
    </div>
    
    <!-- Activity Cards -->
    <ActivityCard 
      v-for="activity in activities" 
      :key="activity.id"
      :activity="activity"
      @toggle-favorite="$emit('toggle-favorite', activity.id)"
      @click="openModal(activity)"
    />
    
    <!-- AI Generated Disclaimer -->
    <div v-if="activities.length > 0" class="ai-disclaimer">
      <p class="disclaimer-text">
        🤖 These suggestions are AI-generated and may not reflect real-time availability, prices or accuracy.
      </p>
    </div>
    
    <ActivityModal
      :is-open="isModalOpen"
      :activity="selectedActivity"
      @close="closeModal"
      @toggle-favorite="handleModalFavorite"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ActivityCard from './ActivityCard.vue'
import ActivityModal from './ActivityModal.vue'

defineProps({
  activities: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  hasSearched: {
    type: Boolean,
    default: false
  },
  currentFact: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['toggle-favorite', 'search-category', 'clear-search'])

const categories = [
  { name: 'Museums', icon: '🏛️', query: 'museums for kids' },
  { name: 'Parks', icon: '🌳', query: 'parks and playgrounds' },
  { name: 'Sports', icon: '⚽', query: 'sports activities for kids' },
  { name: 'Arts & Crafts', icon: '🎨', query: 'arts and crafts for kids' },
  { name: 'Swimming', icon: '🏊', query: 'swimming pools for kids' },
  { name: 'Libraries', icon: '📚', query: 'libraries with kids programs' },
  { name: 'Indoor Play', icon: '🎪', query: 'indoor play areas' },
  { name: 'Nature', icon: '🦋', query: 'nature activities for kids' }
]

const searchExamples = [
  'science centers near me',
  'free activities today',
  'birthday party venues'
]

const isModalOpen = ref(false)
const selectedActivity = ref({})

const openModal = (activity) => {
  selectedActivity.value = activity
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleModalFavorite = () => {
  emit('toggle-favorite', selectedActivity.value.id)
}
</script>

<style scoped>
.activity-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: transparent;
}

/* Empty State Styles */
.intro-section {
  text-align: center;
  padding: 40px 20px;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.intro-icon svg {
  width: 80px;
  height: 80px;
  opacity: 0.9;
}

.intro-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.intro-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 32px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

@media (min-width: 480px) {
  .category-grid {
    grid-template-columns: repeat(4, 1fr);
    max-width: 100%;
  }
}

.category-button {
  background: #FFFFFF;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  cursor: pointer;
}

.category-button:hover {
  border-color: #4EAFD9;
  background-color: #F8FCFF;
  box-shadow: 0 4px 12px rgba(78, 175, 217, 0.15);
}

.category-button:active {
  opacity: 0.9;
}

.category-icon {
  font-size: 28px;
  line-height: 1;
}

.category-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  line-height: 1.2;
}

.search-examples {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #E0E0E0;
}

.examples-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
}

.examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.example-chip {
  background: #F5F5F5;
  border: 1px solid #E0E0E0;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
  color: #666;
  transition: all 0.2s;
  cursor: pointer;
}

.example-chip:hover {
  background: #4EAFD9;
  border-color: #4EAFD9;
  color: #FFFFFF;
}

@media (min-width: 768px) {
  .activity-list {
    padding: 8px;
    gap: 20px;
  }
  
  .intro-section {
    padding: 60px 20px;
  }
  
  .intro-title {
    font-size: 28px;
  }
}

/* Loading Skeleton Styles */
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-card {
  background: #FFFFFF;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-content {
  flex: 1;
  margin-right: 16px;
}

.skeleton-title {
  height: 24px;
  background: #F0F0F0;
  border-radius: 4px;
  margin-bottom: 12px;
  width: 70%;
}

.skeleton-description {
  height: 16px;
  background: #F0F0F0;
  border-radius: 4px;
  margin-bottom: 8px;
  width: 100%;
}

.skeleton-description:nth-child(2) {
  width: 85%;
  margin-bottom: 16px;
}

.skeleton-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-meta-row {
  display: flex;
  gap: 16px;
}

.skeleton-meta-item {
  height: 16px;
  background: #F0F0F0;
  border-radius: 4px;
  width: 120px;
}

.skeleton-meta-item.short {
  width: 80px;
}

.skeleton-favorite {
  width: 40px;
  height: 40px;
  background: #F0F0F0;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Search Fact Styles */
.search-fact {
  background: #F8F9FA;
  border: 1px solid #E9ECEF;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease-in;
}

.fact-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.fact-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.fact-text {
  font-size: 16px;
  color: #495057;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
}

/* No Results State Styles */
.no-results-state {
  text-align: center;
  padding: 40px 20px;
  animation: fadeIn 0.5s ease-in;
}

.no-results-icon {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.no-results-icon svg {
  width: 64px;
  height: 64px;
}

.no-results-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.no-results-description {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.5;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.try-again-button {
  padding: 10px 20px;
  border: 2px solid #4EAFD9;
  background-color: #4EAFD9;
  color: white;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.try-again-button:hover {
  background-color: #3B9AC3;
}

.try-again-button:active {
  background-color: #2E8BAF;
}

@media (min-width: 768px) {
  .try-again-button {
    padding: 12px 24px;
    font-size: 15px;
  }
}

/* AI Disclaimer Styles */
.ai-disclaimer {
  padding: 10px;
  text-align: center;
}

.disclaimer-text {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.4;
  margin: 0;
}

@media (min-width: 768px) {
  .ai-disclaimer {
    padding: 14px;
  }
  
  .disclaimer-text {
    font-size: 13px;
  }
}

/* Pulsating animation for skeleton loading */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

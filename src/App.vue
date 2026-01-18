<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <SearchBar 
        v-model="searchQuery"
        @search="handleSearch"
      />
      <FilterButtons 
        :activeFilter="activeFilter"
        @filter-change="handleFilterChange"
      />
      <ActivityList 
        :activities="activities"
        @toggle-favorite="handleToggleFavorite"
      />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import SearchBar from './components/SearchBar.vue'
import FilterButtons from './components/FilterButtons.vue'
import ActivityList from './components/ActivityList.vue'

const searchQuery = ref('')
const activeFilter = ref('distance')

// Sample data - will be replaced with API calls
const activities = ref([
  {
    id: '1',
    name: 'Adventure Playground',
    description: 'Fun slides and swings for all ages.',
    image: new URL('./assets/playground.svg', import.meta.url).href,
    isFavorite: true
  },
  {
    id: '2',
    name: 'Wildlife Park',
    description: 'Meet friendly Australian animals.',
    image: new URL('./assets/animals.svg', import.meta.url).href,
    isFavorite: true
  },
  {
    id: '3',
    name: 'Kids Play Zone',
    description: 'Indoor playground with climbing structures.',
    image: new URL('./assets/playground.svg', import.meta.url).href,
    isFavorite: false
  },
  {
    id: '4',
    name: 'Petting Zoo',
    description: 'Get up close with farm animals.',
    image: new URL('./assets/animals.svg', import.meta.url).href,
    isFavorite: true
  },
  {
    id: '5',
    name: 'Nature Adventure',
    description: 'Explore nature trails and spot wildlife.',
    image: new URL('./assets/animals.svg', import.meta.url).href,
    isFavorite: false
  }
])

const handleSearch = () => {
  console.log('Searching for:', searchQuery.value)
  // TODO: Implement API call to backend
}

const handleFilterChange = (filter) => {
  activeFilter.value = filter
  console.log('Filter changed to:', filter)
  // TODO: Implement sorting/filtering logic
}

const handleToggleFavorite = (activityId) => {
  const activity = activities.value.find(a => a.id === activityId)
  if (activity) {
    activity.isFavorite = !activity.isFavorite
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  background-color: #FFFFFF;
}

.main-content {
  padding-top: 90px; /* Account for fixed header */
}
</style>

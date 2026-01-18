<template>
  <div class="filter-buttons-container">
    <div class="filter-buttons">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        class="filter-button"
        :class="{ active: activeFilter === filter.value }"
        @click="selectFilter(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activeFilter: {
    type: String,
    default: 'distance'
  }
})

const emit = defineEmits(['filter-change'])

const filters = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'popularity', label: 'Popularity' }
]

const selectFilter = (filterValue) => {
  emit('filter-change', filterValue)
}
</script>

<style scoped>
.filter-buttons-container {
  background-color: #FFFFFF;
  padding: 32px 16px 16px;
  position: relative;
}

.filter-buttons-container::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 16px;
  right: 16px;
  height: 1px;
  background-color: #D0D0D0;
}

.filter-buttons {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.filter-buttons::-webkit-scrollbar {
  display: none;
}

.filter-button {
  flex-shrink: 0;
  padding: 10px 20px;
  border: 2px solid #4EAFD9;
  background-color: transparent;
  color: #4EAFD9;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-button:hover {
  background-color: rgba(78, 175, 217, 0.1);
}

.filter-button.active {
  background-color: #4EAFD9;
  color: white;
}

@media (min-width: 768px) {
  .filter-buttons-container {
    padding: 32px 8px 16px;
  }
  
  .filter-buttons {
    justify-content: center;
  }
  
  .filter-button {
    padding: 12px 24px;
    font-size: 15px;
  }
}
</style>

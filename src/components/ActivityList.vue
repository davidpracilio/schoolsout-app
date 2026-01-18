<template>
  <div class="activity-list">
    <ActivityCard 
      v-for="activity in activities" 
      :key="activity.id"
      :activity="activity"
      @toggle-favorite="$emit('toggle-favorite', activity.id)"
      @click="openModal(activity)"
    />
    
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
  }
})

const emit = defineEmits(['toggle-favorite'])

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

@media (min-width: 768px) {
  .activity-list {
    padding: 8px;
    gap: 20px;
  }
}
</style>

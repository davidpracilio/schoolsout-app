<template>
  <div class="activity-card" @click="$emit('click')">
    <div class="card-image">
      <img 
        :src="activity.image" 
        :alt="activity.name"
      />
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ activity.name }}</h3>
      <p class="card-description">{{ activity.description }}</p>
    </div>
    
    <button 
      v-if="activity.isFavorite"
      class="favorite-button active"
      @click.stop="$emit('toggle-favorite')"
      aria-label="Remove from favorites"
    >
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" 
          fill="#FFD700"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  activity: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle-favorite', 'click'])
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
}

.card-image {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  background-color: #F5F5F5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  margin: 0;
  font-size: 13px;
  color: #666;
  line-height: 1.4;
}

.favorite-button {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.favorite-button:hover {
  transform: scale(1.1);
}

.favorite-button:active {
  transform: scale(0.95);
}

.favorite-button svg {
  width: 24px;
  height: 24px;
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

<template>
  <div class="activity-card">
    <div class="card-content">
      <h3 class="card-title">{{ activity.name }}</h3>
      <p class="card-description">{{ activity.description }}</p>
      <div class="card-meta">
        <span v-if="activity.location" class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4EAFD9"/>
          </svg>
          <span class="meta-text">{{ activity.location }}</span>
        </span>
        <span v-if="activity.ageRange" class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#9B59B6"/>
          </svg>
          <span class="meta-text">{{ activity.ageRange }}</span>
        </span>
        <span v-if="activity.price" class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="#27AE60"/>
          </svg>
          <span class="meta-text">{{ activity.price }}</span>
        </span>
        <span class="meta-item">
          <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.59 13.41c.41.39.41 1.03 0 1.42-.39.39-1.03.39-1.42 0a5.003 5.003 0 010-7.07l3.54-3.54a5.003 5.003 0 017.07 0 5.003 5.003 0 010 7.07l-1.49 1.49c.01-1.18-.78-2.26-2-2.26-.55 0-1 .45-1 1s.45 1 1 1c.28 0 .53-.11.71-.29l1.49-1.49a3.003 3.003 0 000-4.24 3.003 3.003 0 00-4.24 0l-3.54 3.54a3.003 3.003 0 000 4.24zm2.82-4.24c.39-.39 1.03-.39 1.42 0a5.003 5.003 0 010 7.07l-3.54 3.54a5.003 5.003 0 01-7.07 0 5.003 5.003 0 010-7.07l1.49-1.49c-.01 1.18.78 2.26 2 2.26.55 0 1-.45 1-1s-.45-1-1-1c-.28 0-.53.11-.71.29L8.46 10.7a3.003 3.003 0 000 4.24 3.003 3.003 0 004.24 0l3.54-3.54a3.003 3.003 0 000-4.24.973.973 0 010-1.42z" fill="#4EAFD9"/>
          </svg>
          <a :href="activity.bookingUrl && !activity.bookingUrl.includes('example.com') && activity.bookingUrl !== 'Not available' ? activity.bookingUrl : `https://www.google.com/search?q=${encodeURIComponent(activity.name)}`" target="_blank" @click.stop class="meta-text">{{ activity.bookingUrl && !activity.bookingUrl.includes('example.com') && activity.bookingUrl !== 'Not available' ? 'Visit' : 'See Results' }}</a>
        </span>
      </div>
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
    
    <!-- <a v-if="activity.bookingUrl && !activity.bookingUrl.includes('example.com')" class="visit-button" :href="activity.bookingUrl" target="_blank" @click.stop>Visit</a> -->
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
}

.activity-card:hover {
  border-color: #A0A0A0;
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

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
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

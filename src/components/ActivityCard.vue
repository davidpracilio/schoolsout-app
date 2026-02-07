<template>
  <div class="activity-card" @click="handleCardClick">
    <div class="card-content">
      <h3 class="card-title">{{ activity.name }}</h3>
      <p class="card-description">{{ activity.description }}</p>
      <hr class="card-divider">
      
      <span class="location-item">
        <svg class="meta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#4EAFD9"/>
        </svg>
        <span class="meta-text">{{ (activity.location && !activity.location.includes('Not available')) ? activity.location : 'Check the website' }}</span>
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
      <span class="click-indicator">↗</span>
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
const { activity } = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

defineEmits(['toggle-favorite', 'click'])

const handleCardClick = () => {
  const url = activity.bookingUrl && !activity.bookingUrl.includes('example.com') && !activity.bookingUrl.includes('Not available') ? activity.bookingUrl : `https://www.google.com/search?q=${encodeURIComponent(activity.name)}`;
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
  max-width: calc(100% - 100px); /* Leave space for the button on the right */
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

.click-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 14px;
  color: #999;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.activity-card:hover .click-indicator {
  opacity: 1;
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

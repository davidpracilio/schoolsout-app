<template>
  <div class="loading-feedback">
    <div class="loading-card">
      <!-- Progress Bar -->
      <!-- <div class="progress-container">
        <div class="progress-segments">
          <div 
            v-for="(segment, index) in 24" 
            :key="index"
            class="segment"
            :class="{ 
              'filled': index < Math.ceil((progressPercentage / 100) * 24)
            }"
            :style="getSegmentColor(index)"
          ></div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { loadingTips } from '../data/loadingTips.js'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const currentTip = ref('')
const statusMessage = ref('Fetching suggestions...')
let tipInterval = null
let progressInterval = null
let statusInterval = null
let tipIndex = 0
const progressPercentage = ref(0)

const statusMessages = [
  'Sending your search query...',
  'Compiling results...',
  'Returning to you...'
]
let currentStatusIndex = 0

const getRandomTip = () => {
  tipIndex = Math.floor(Math.random() * loadingTips.length)
  return loadingTips[tipIndex]
}

const startTipCycling = () => {
  // Set initial tip
  currentTip.value = getRandomTip()
  
  // Cycle tips every 5 seconds
  tipInterval = setInterval(() => {
    currentTip.value = getRandomTip()
  }, 5000)
}

const stopTipCycling = () => {
  if (tipInterval) {
    clearInterval(tipInterval)
    tipInterval = null
  }
}

const startStatusCycling = () => {
  currentStatusIndex = 0
  statusMessage.value = statusMessages[0]
  
  // Cycle through status messages every 7 seconds
  statusInterval = setInterval(() => {
    currentStatusIndex = (currentStatusIndex + 1) % statusMessages.length
    statusMessage.value = statusMessages[currentStatusIndex]
  }, 7000)
}

const stopStatusCycling = () => {
  if (statusInterval) {
    clearInterval(statusInterval)
    statusInterval = null
  }
}

const startProgressAnimation = () => {
  progressPercentage.value = 0
  
  // Simulate progress: slowly increase to 95% over ~20 seconds, then jump to 100% when done
  progressInterval = setInterval(() => {
    if (progressPercentage.value < 98) {
      // Gradually increase with very small increments (0.5-2% per 300ms)
      const increment = Math.random() * (2 - 0.5) + 0.5
      progressPercentage.value = Math.min(progressPercentage.value + increment, 95)
    }
  }, 300)
}

const completeProgress = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
  progressPercentage.value = 100
}

const stopProgressAnimation = () => {
  if (progressInterval) {
    clearInterval(progressInterval)
    progressInterval = null
  }
}

const getSegmentColor = (index) => {
  const filledSegments = Math.ceil((progressPercentage.value / 100) * 24)
  
  if (index >= filledSegments) {
    return { backgroundColor: '#E5E7EB' }
  }
  
  // Calculate the position of this segment (0 to 1)
  const segmentPosition = index / 24
  
  // Define color stops: red -> yellow -> blue
  let color
  if (segmentPosition < 0.33) {
    // Red to Yellow transition (0 to 0.33)
    const t = segmentPosition / 0.33
    const r = Math.round(239 - (239 - 251) * t)
    const g = Math.round(68 + (191 - 68) * t)
    const b = Math.round(68 + (36 - 68) * t)
    color = `rgb(${r}, ${g}, ${b})`
  } else if (segmentPosition < 0.66) {
    // Yellow to Blue transition (0.33 to 0.66)
    const t = (segmentPosition - 0.33) / 0.33
    const r = Math.round(251 - (251 - 78) * t)
    const g = Math.round(191 - (191 - 175) * t)
    const b = Math.round(36 + (217 - 36) * t)
    color = `rgb(${r}, ${g}, ${b})`
  } else {
    // Blue (0.66 to 1)
    color = '#4EAFD9'
  }
  
  return { backgroundColor: color }
}

onMounted(() => {
  if (props.loading) {
    startTipCycling()
    startStatusCycling()
    startProgressAnimation()
  }
})

onUnmounted(() => {
  stopTipCycling()
  stopStatusCycling()
  stopProgressAnimation()
})

// Watch for loading state changes
watch(() => props.loading, (newLoading) => {
  if (newLoading) {
    startTipCycling()
    startStatusCycling()
    startProgressAnimation()
  } else {
    stopTipCycling()
    stopStatusCycling()
    completeProgress()
    // Reset after a short delay
    setTimeout(() => {
      progressPercentage.value = 0
    }, 500)
  }
})
</script>

<style scoped>
.loading-feedback {
  animation: fadeIn 0.3s ease-in;
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

.loading-card {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 0;
  margin-bottom: -2px;
  box-shadow: none;
}

.pro-tip-section {
  margin-bottom: 12px;
}

.pro-tip-text {
  font-size: 13px;
  color: #2c3e50;
  line-height: 1.5;
  margin: 0;
  font-weight: 500;
  min-height: 20px;
  animation: tipFadeIn 0.4s ease-in;
}

@keyframes tipFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.loading-status {
  margin-bottom: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: #999;
  font-weight: 400;
}

.loading-dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #4EAFD9;
  animation: bounce 1.4s infinite;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% {
    opacity: 0.6;
    transform: translateY(0);
  }
  40% {
    opacity: 1;
    transform: translateY(-8px);
  }
}

/* Progress Bar Styles */
.progress-container {
  width: 100%;
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
}

.progress-segments {
  display: flex;
  gap: 6px;
  width: 40%;
  align-items: center;
  justify-content: center;
  height: 32px;
}

.segment {
  flex: 1;
  height: 100%;
  width: 1px;
  background-color: #E5E7EB;
  border-radius: 4px;
  transition: background-color 0.2s ease-out;
}

.segment.filled.red {
  background-color: #EF4444;
}

.segment.filled.yellow {
  background-color: #FBBF24;
}

.segment.filled.blue {
  background-color: #4EAFD9;
}

@media (min-width: 768px) {
  .loading-card {
    padding: 0;
  }

  .pro-tip-text {
    font-size: 17px;
  }

  .status-text {
    font-size: 15px;
  }
}
</style>

<template>
  <div class="loading-feedback">
    <div class="spinner"></div>
    <p :key="statusMessage" class="status-message">{{ statusMessage }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const statusMessages = [
  'Searching for activities...',
  'Scouring the web for options...',
  'Finding the best matches near you...',
  'Collating the results...',
  'Almost there...',
]

const statusMessage = ref(statusMessages[0])
let cycleInterval = null
let index = 0

const startCycling = () => {
  index = 0
  statusMessage.value = statusMessages[0]
  cycleInterval = setInterval(() => {
    index = (index + 1) % statusMessages.length
    statusMessage.value = statusMessages[index]
  }, 3500)
}

const stopCycling = () => {
  if (cycleInterval) {
    clearInterval(cycleInterval)
    cycleInterval = null
  }
}

onMounted(() => { if (props.loading) startCycling() })
onUnmounted(stopCycling)

watch(() => props.loading, (val) => {
  if (val) startCycling()
  else stopCycling()
})
</script>

<style scoped>
.loading-feedback {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px 20px 48px;
  animation: fadeIn 0.4s ease-out;
}

.spinner {
  width: 44px;
  height: 44px;
  border: 3px solid #E8E8E8;
  border-top-color: #4EAFD9;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
}

.status-message {
  font-size: 15px;
  color: #666;
  margin: 0;
  animation: fadeIn 0.4s ease-out;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

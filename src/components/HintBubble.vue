<template>
  <transition name="hint-fade">
    <div v-if="visible" class="hint-bubble" :class="`hint-bubble--${placement}`" @click.stop>
      <p class="hint-bubble-text">{{ text }}</p>
      <button class="hint-bubble-dismiss" @click.stop="dismiss">Got it!</button>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useHints } from '../composables/useHints'

const props = defineProps({
  hintId: { type: String, required: true },
  text: { type: String, required: true },
  placement: { type: String, default: 'bottom' }
})

const { isSeen, markSeen } = useHints()
const visible = ref(!isSeen(props.hintId))

const dismiss = () => {
  markSeen(props.hintId)
  visible.value = false
}

defineExpose({ dismiss })
</script>

<style scoped>
.hint-bubble {
  position: absolute;
  z-index: 20;
  background-color: #757575;
  color: white;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.4;
  width: max-content;
  max-width: 220px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.hint-bubble::before {
  content: '';
  position: absolute;
  width: 0;
  height: 0;
  border: 7px solid transparent;
}

.hint-bubble--bottom {
  top: calc(100% + 12px);
  right: 0;
}

.hint-bubble--bottom::before {
  bottom: 100%;
  right: 16px;
  border-bottom-color: #757575;
}

.hint-bubble--bottom-left {
  top: calc(100% + 12px);
  left: 14px;
}

.hint-bubble--bottom-left::before {
  bottom: 100%;
  left: 16px;
  border-bottom-color: #757575;
}

.hint-bubble-text {
  margin: 0;
}

.hint-bubble-dismiss {
  align-self: flex-end;
  background: none;
  border: none;
  color: #7ecbec;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  padding: 0;
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>

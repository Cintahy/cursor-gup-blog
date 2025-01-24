<template>
  <div class="type-writer">
    <transition name="fade" mode="out-in">
      <div 
        :key="currentText" 
        class="text"
      >
        {{ displayText }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps<{
  texts: string[]
  interval?: number
  typeSpeed?: number
}>()

const currentIndex = ref(0)
const displayText = ref('')
const currentText = ref('')
let intervalId: NodeJS.Timeout
let typeTimer: NodeJS.Timeout

function typeText() {
  const text = props.texts[currentIndex.value]
  currentText.value = text
  let index = 0
  
  function type() {
    if (index <= text.length) {
      displayText.value = text.slice(0, index)
      index++
      typeTimer = setTimeout(type, props.typeSpeed || 100)
    }
  }
  
  type()
}

function startTyping() {
  typeText()
  intervalId = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.texts.length
    typeText()
  }, props.interval || 3000)
}

onMounted(() => {
  startTyping()
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
  clearTimeout(typeTimer)
})
</script>

<style scoped>
.type-writer {
  min-height: 1.5em;
}

.text {
  position: relative;
}

.text::after {
  content: '|';
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 
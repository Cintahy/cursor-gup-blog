<template>
  <div class="reading-progress">
    <div 
      class="progress-bar"
      :style="{ width: `${progress}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function updateProgress() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement
  const windowHeight = scrollHeight - clientHeight
  progress.value = (scrollTop / windowHeight) * 100
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress)
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  z-index: 1000;
  background: var(--vp-c-bg-soft);
}

.progress-bar {
  height: 100%;
  background: var(--vp-c-brand);
  transition: width 0.2s;
}
</style> 
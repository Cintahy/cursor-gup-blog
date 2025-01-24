<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="visible" 
        class="image-preview"
        @click="close"
      >
        <div class="preview-content" @click.stop>
          <img 
            v-if="imageSrc"
            :src="imageSrc"
            :alt="imageSrc"
            :class="{ 'is-zoomed': isZoomed }"
            @click="toggleZoom"
          >
        </div>
        <button class="close-btn" @click="close">
          <i class="iconfont icon-close"></i>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(false)
const imageSrc = ref('')
const isZoomed = ref(false)

function open(src: string) {
  imageSrc.value = src
  visible.value = true
  isZoomed.value = false
  document.body.style.overflow = 'hidden'
}

function close() {
  visible.value = false
  isZoomed.value = false
  document.body.style.overflow = ''
}

function toggleZoom() {
  isZoomed.value = !isZoomed.value
}

// 暴露方法给父组件
defineExpose({
  open,
  close
})
</script>

<style scoped>
.image-preview {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
}

.preview-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.preview-content img.is-zoomed {
  transform: scale(1.5);
  cursor: zoom-out;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg);
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
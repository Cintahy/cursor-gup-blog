<template>
  <div 
    class="lazy-image"
    :class="{ 
      'is-loaded': isLoaded,
      'has-error': hasError,
      'is-loading': !isLoaded && !hasError
    }"
  >
    <!-- 加载占位 -->
    <div class="image-placeholder" v-if="!isLoaded && !hasError">
      <div class="loading-spinner">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20"></circle>
        </svg>
      </div>
      <span class="loading-text">加载中...</span>
    </div>

    <!-- 图片 -->
    <img
      ref="imageRef"
      :src="src"
      :alt="alt"
      class="image"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
      :draggable="false"
    >

    <!-- 错误提示 -->
    <div class="error-message" v-if="hasError">
      <i class="iconfont icon-image-error"></i>
      <span>图片加载失败</span>
      <button class="retry-btn" @click="retryLoad">
        重试
      </button>
    </div>

    <!-- 预览提示 -->
    <div class="preview-hint" v-if="preview && isLoaded">
      <i class="iconfont icon-zoom-in"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
  src: string
  alt?: string
  preview?: boolean
  aspectRatio?: string | number
}>()

const imageRef = ref<HTMLImageElement>()
const isLoaded = ref(false)
const hasError = ref(false)
const isIntersecting = ref(false)

// 计算图片样式
const imageStyle = computed(() => ({
  aspectRatio: props.aspectRatio,
  opacity: isLoaded.value ? 1 : 0
}))

// 监听图片进入视口
useIntersectionObserver(imageRef, ([{ isIntersecting: flag }]) => {
  isIntersecting.value = flag
}, {
  threshold: 0.1,
  rootMargin: '50px'
})

// 处理图片加载
function handleLoad() {
  isLoaded.value = true
  hasError.value = false
}

// 处理加载错误
function handleError() {
  hasError.value = true
  isLoaded.value = false
}

// 重试加载
function retryLoad() {
  hasError.value = false
  const img = imageRef.value
  if (img) {
    // 添加时间戳避免缓存
    img.src = `${props.src}?t=${Date.now()}`
  }
}
</script>

<style scoped>
.lazy-image {
  position: relative;
  width: 100%;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.image-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background: var(--vp-c-bg-soft);
}

.loading-spinner {
  width: 40px;
  height: 40px;
}

.loading-spinner svg {
  width: 100%;
  height: 100%;
  animation: rotate 2s linear infinite;
}

.loading-spinner circle {
  fill: none;
  stroke: var(--vp-c-brand);
  stroke-width: 4;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.loading-text {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.error-message {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.error-message i {
  font-size: 2rem;
  color: var(--vp-c-danger);
}

.retry-btn {
  margin-top: 0.5rem;
  padding: 0.4rem 1rem;
  border: none;
  border-radius: 20px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
  cursor: zoom-in;
}

.lazy-image:hover .preview-hint {
  opacity: 1;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 深色模式优化 */
:root.dark .lazy-image {
  background: rgba(255, 255, 255, 0.02);
}

:root.dark .image-placeholder,
:root.dark .error-message {
  background: rgba(255, 255, 255, 0.02);
}
</style> 
<template>
  <Transition name="fade">
    <div 
      v-show="show" 
      class="back-to-top"
      @click="scrollToTop"
      role="button"
      aria-label="返回顶部"
    >
      <i class="iconfont icon-arrow-up"></i>
      <span class="back-to-top-text">TOP</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const show = ref(false)
const scrollThreshold = 100 // 降低显示阈值
const throttleDelay = 50 // 减少节流延迟

// 节流函数
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let lastTime = 0

  return function(this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  } as T
}

// 检查是否显示按钮
function checkScroll() {
  const currentScroll = window.scrollY
  const shouldShow = currentScroll > scrollThreshold
  
  // 只在状态改变时更新，避免不必要的重渲染
  if (shouldShow !== show.value) {
    show.value = shouldShow
  }
}

// 平滑滚动到顶部
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 使用更快的节流检查
const throttledCheck = throttle(checkScroll, throttleDelay)

onMounted(() => {
  window.addEventListener('scroll', throttledCheck, { passive: true })
  // 初始检查
  checkScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledCheck)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  width: 3rem;
  height: 3rem;
  background: var(--vp-c-brand);
  color: white;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 100;
}

.back-to-top:hover {
  transform: translateY(-3px);
  background: var(--vp-c-brand-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.back-to-top i {
  font-size: 1.2rem;
  line-height: 1;
  margin-bottom: 0.1rem;
}

.back-to-top-text {
  font-size: 0.7rem;
  line-height: 1;
  font-weight: 500;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 深色模式优化 */
:root.dark .back-to-top {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:root.dark .back-to-top:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-to-top {
    right: 1rem;
    bottom: 1rem;
    width: 2.5rem;
    height: 2.5rem;
  }

  .back-to-top i {
    font-size: 1rem;
  }

  .back-to-top-text {
    font-size: 0.6rem;
  }
}
</style> 
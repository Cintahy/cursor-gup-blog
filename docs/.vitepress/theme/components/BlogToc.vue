<template>
  <div class="blog-toc" :class="{ 'is-active': isActive }">
    <div class="toc-header">
      <h3 class="toc-title">
        <i class="iconfont icon-list"></i>
        目录
      </h3>
    </div>

    <nav class="toc-nav">
      <ul class="toc-list">
        <li 
          v-for="header in headers" 
          :key="header.id"
          class="toc-item"
          :class="[
            `level-${header.level}`,
            { active: activeHeader === header.id }
          ]"
        >
          <a 
            :href="`#${header.id}`"
            class="toc-link"
            @click="handleClick"
          >
            {{ header.title }}
          </a>
        </li>
      </ul>
    </nav>

    <!-- 进度指示器 -->
    <div class="toc-progress">
      <div 
        class="progress-bar"
        :style="{ width: `${readingProgress}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  headers: Array<{
    id: string
    level: number
    title: string
  }>
  activeHeader: string
}>()

const isActive = ref(false)
const readingProgress = ref(0)

// 计算阅读进度
function updateReadingProgress() {
  const docEl = document.documentElement
  const winHeight = window.innerHeight
  const docHeight = docEl.scrollHeight - winHeight
  const scrollTop = window.scrollY
  readingProgress.value = Math.min(100, Math.round((scrollTop / docHeight) * 100))
}

// 平滑滚动到目标位置
function handleClick(e: MouseEvent) {
  e.preventDefault()
  const href = (e.target as HTMLAnchorElement).getAttribute('href')
  if (href) {
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

// 监听滚动事件
onMounted(() => {
  window.addEventListener('scroll', updateReadingProgress, { passive: true })
  updateReadingProgress()

  // 检测鼠标位置来显示/隐藏目录
  const handleMouseMove = (e: MouseEvent) => {
    const threshold = window.innerWidth - 300 // 右侧300px区域
    isActive.value = e.clientX > threshold
  }
  window.addEventListener('mousemove', handleMouseMove)

  onUnmounted(() => {
    window.removeEventListener('scroll', updateReadingProgress)
    window.removeEventListener('mousemove', handleMouseMove)
  })
})
</script>

<style scoped>
.blog-toc {
  position: fixed;
  top: calc(var(--vp-nav-height) + 2rem);
  right: 1rem;
  width: 240px;
  max-height: calc(100vh - var(--vp-nav-height) - 4rem);
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow-y: auto;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.blog-toc:hover,
.blog-toc.is-active {
  opacity: 1;
  transform: translateX(-1rem);
}

.toc-header {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.toc-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toc-nav {
  margin-bottom: 1rem;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0.25rem 0;
  line-height: 1.5;
  font-size: 0.9rem;
}

.toc-item.level-2 {
  padding-left: 0;
}

.toc-item.level-3 {
  padding-left: 1rem;
}

.toc-item.level-4 {
  padding-left: 2rem;
}

.toc-link {
  display: block;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 2px solid transparent;
  padding-left: 0.5rem;
}

.toc-item.active .toc-link {
  color: var(--vp-c-brand);
  border-left-color: var(--vp-c-brand);
  background: var(--vp-c-brand-dimm);
}

.toc-link:hover {
  color: var(--vp-c-brand);
}

.toc-progress {
  height: 2px;
  background: var(--vp-c-divider);
  border-radius: 1px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--vp-c-brand);
  transition: width 0.3s ease;
}

/* 深色模式优化 */
:root.dark .blog-toc {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

/* 移动端隐藏 */
@media (max-width: 1280px) {
  .blog-toc {
    display: none;
  }
}
</style> 
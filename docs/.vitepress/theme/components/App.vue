<template>
  <div class="theme-container">
    <BlogHeader>
      <template #nav-right>
        <BlogSearch />
      </template>
    </BlogHeader>
    
    <Transition 
      name="page"
      mode="out-in"
      @before-enter="onBeforeEnter"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave"
    >
      <main class="main" :key="route.path">
        <HomeLayout v-if="isHome" />
        <BlogPost v-else-if="isPost" />
        <Content v-else class="content" />
      </main>
    </Transition>

    <BlogFooter />
    
    <!-- 添加返回顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { computed } from 'vue'
import { Content } from 'vitepress/client'
import BlogHeader from './BlogHeader.vue'
import BlogFooter from './BlogFooter.vue'
import HomeLayout from './HomeLayout.vue'
import BlogSearch from './BlogSearch.vue'
import BlogPost from './BlogPost.vue'
import BackToTop from './BackToTop.vue'  // 导入组件

const { page, theme } = useData()
const route = useRoute()

const isHome = computed(() => page.value.frontmatter.layout === 'home')
const isPost = computed(() => {
  return page.value.relativePath.startsWith('posts/') && 
         page.value.relativePath !== 'posts/index.md'
})

// 页面过渡动画钩子
function onBeforeEnter(el: Element) {
  (el as HTMLElement).style.opacity = '0'
  ;(el as HTMLElement).style.transform = 'translateY(20px)'
}

function onEnter(el: Element, done: () => void) {
  requestAnimationFrame(() => {
    (el as HTMLElement).style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    ;(el as HTMLElement).style.opacity = '1'
    ;(el as HTMLElement).style.transform = 'translateY(0)'
  })
  setTimeout(done, 400)
}

function onAfterEnter(el: Element) {
  (el as HTMLElement).style.transition = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onBeforeLeave(el: Element) {
  (el as HTMLElement).style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  ;(el as HTMLElement).style.opacity = '1'
  ;(el as HTMLElement).style.transform = 'translateY(0)'
}

function onLeave(el: Element, done: () => void) {
  requestAnimationFrame(() => {
    (el as HTMLElement).style.opacity = '0'
    ;(el as HTMLElement).style.transform = 'translateY(-20px)'
  })
  setTimeout(done, 400)
}
</script>

<style scoped>
.theme-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

.main {
  flex: 1;
  margin-top: 64px; /* 为固定导航栏留出空间 */
  will-change: transform, opacity;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 页面过渡动画基础样式 */
.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* 淡入淡出效果 */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  /* 移动端使用更简单的动画 */
  .page-enter-from,
  .page-leave-to {
    transform: translateY(0);
  }
}

/* 优化性能 */
@media (prefers-reduced-motion: reduce) {
  .main {
    transition: none !important;
    transform: none !important;
  }
}
</style> 
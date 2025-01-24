<template>
  <article class="blog-post">
    <!-- 阅读进度条 -->
    <ReadingProgress />
    
    <div class="post-container">
      <!-- 文章头部 -->
      <PostHeader 
        :frontmatter="frontmatter"
        :site="site"
        :pageViews="pageViews"
        :readingTime="readingTime"
        :wordCount="wordCount"
      />

      <!-- 文章内容 -->
      <div class="post-content vp-doc" ref="contentRef">
        <Content />
      </div>

      <!-- 文章底部 -->
      <PostFooter 
        :frontmatter="frontmatter"
        :site="site"
        :pageViews="pageViews"
        :readingTime="readingTime"
        :pageUrl="pageUrl"
        :prevPost="prevPost"
        :nextPost="nextPost"
      />

      <!-- 添加评论组件 -->
      <BlogComment v-if="theme.comment?.repo" />
    </div>

    <!-- 侧边栏组件 -->
    <BlogToc 
      v-if="showToc" 
      :headers="headers"
      :active-header="activeHeader"
    />
  </article>
</template>

<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { onMounted, onUnmounted, ref, computed, nextTick } from 'vue'
import { Content } from 'vitepress/client'
import { calculateReadingTime, formatDate } from '../utils'
import PostHeader from './post/PostHeader.vue'
import PostFooter from './post/PostFooter.vue'
import BlogToc from './BlogToc.vue'
import ReadingProgress from './ReadingProgress.vue'
import BlogComment from './BlogComment.vue'
import type { ComponentPublicInstance } from 'vue'

// 组件状态
const { theme, frontmatter, page, site } = useData()
const route = useRoute()
const contentRef = ref<HTMLElement>()
const pageViews = ref(0) // TODO: 从后端获取实际数据

// 计算属性
const post = computed(() => ({
  ...frontmatter.value,
  path: route.path
}))

const { prevPost, nextPost } = computed(() => {
  const posts = theme.value.posts || []
  const currentIndex = posts.findIndex(p => p.path === route.path)
  return {
    prevPost: currentIndex > 0 ? posts[currentIndex - 1] : null,
    nextPost: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null
  }
}).value

const readingTime = computed(() => calculateReadingTime(page.value.html))

const pageUrl = computed(() => `${site.value.base}${page.value.relativePath}`)

const wordCount = computed(() => {
  const content = page.value.html || ''
  return content.replace(/<[^>]*>/g, '').length
})

// 目录相关
const headers = ref<Array<{ id: string, level: number, title: string }>>([])
const activeHeader = ref('')
const showToc = computed(() => headers.value.length > 0)

// 节流函数
function throttle<T extends (...args: any[]) => any>(fn: T, delay: number): T {
  let timer: NodeJS.Timeout | null = null
  let lastArgs: Parameters<T> | null = null

  return function(this: any, ...args: Parameters<T>) {
    lastArgs = args
    if (timer) return

    timer = setTimeout(() => {
      fn.apply(this, lastArgs!)
      timer = null
      lastArgs = null
    }, delay)
  } as T
}

// 更新活动标题
function updateActiveHeader() {
  if (!headers.value.length) return

  const scrollTop = window.scrollY
  const headerElements = headers.value.map(header => {
    const el = document.getElementById(header.id)
    if (!el) return { id: header.id, top: 0 }
    const { top } = el.getBoundingClientRect()
    return { id: header.id, top: top + scrollTop }
  })

  headerElements.push({
    id: '',
    top: document.documentElement.scrollHeight
  })

  const viewportTop = scrollTop + 100
  let current = headerElements[0].id

  for (let i = 0; i < headerElements.length - 1; i++) {
    const { id, top } = headerElements[i]
    const nextTop = headerElements[i + 1].top

    if (viewportTop >= top && viewportTop < nextTop) {
      current = id
      break
    }
  }

  if (current !== activeHeader.value) {
    activeHeader.value = current
  }
}

const throttledUpdateActiveHeader = throttle(updateActiveHeader, 100)

// 监听内容变化
onMounted(() => {
  nextTick(() => {
    if (!contentRef.value) return
    
    // 获取标题元素
    const titleElements = contentRef.value.querySelectorAll('h2, h3, h4')
    headers.value = Array.from(titleElements).map(el => ({
      id: el.id,
      level: Number(el.tagName[1]),
      title: el.textContent || ''
    }))

    // 监听滚动
    window.addEventListener('scroll', throttledUpdateActiveHeader, { passive: true })
    updateActiveHeader()

    // 监听内容变化
    const observer = new MutationObserver(() => {
      const newTitleElements = contentRef.value?.querySelectorAll('h2, h3, h4')
      if (newTitleElements) {
        headers.value = Array.from(newTitleElements).map(el => ({
          id: el.id,
          level: Number(el.tagName[1]),
          title: el.textContent || ''
        }))
        updateActiveHeader()
      }
    })

    if (contentRef.value) {
      observer.observe(contentRef.value, {
        childList: true,
        subtree: true
      })
    }

    // 添加图片点击事件监听
    const content = contentRef.value
    if (content) {
      content.addEventListener('click', (e: Event) => {
        const target = e.target as HTMLElement
        if (target.tagName === 'IMG') {
          const src = target.getAttribute('src')
          if (src) {
            window.$imagePreview?.open(src)
            e.preventDefault()
          }
        }
      })
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', throttledUpdateActiveHeader)
  // 不再需要移除事件监听
})
</script>

<style scoped>
.blog-post {
  position: relative;
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 2rem 24px;
}

.post-container {
  max-width: 800px;
  margin: 0 auto;
}

.post-content {
  margin: 2rem 0 4rem;
}

.post-content :deep(h1) {
  font-size: 2rem;
  margin: 2rem 0 1.5rem;
}

.post-content :deep(h2) {
  font-size: 1.5rem;
  margin: 1.8rem 0 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.post-content :deep(h3) {
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem;
}

.post-content :deep(p) {
  margin: 1rem 0;
  line-height: 1.7;
}

.post-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  cursor: zoom-in;
  transition: transform 0.3s;
}

.post-content :deep(img:hover) {
  transform: scale(1.02);
}

@media (max-width: 768px) {
  .blog-post {
    padding: 1rem 16px;
  }
  
  .post-content {
    margin: 1.5rem 0 3rem;
  }
}
</style> 
<template>
  <div class="blog-archive" :class="{ 'is-hovering': isHovering }" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 归档统计 -->
    <div class="archive-header">
      <h1 class="archive-title">
        <i class="iconfont icon-archive"></i>
        文章归档
      </h1>
      <div class="archive-stats">
        共 {{ totalPosts }} 篇文章
      </div>
    </div>

    <!-- 时间线 -->
    <div class="timeline">
      <div 
        v-for="(group, year) in groupedPosts" 
        :key="year" 
        class="year-group"
      >
        <div class="year-label">{{ year }}</div>
        
        <div class="posts-list">
          <div 
            v-for="post in group" 
            :key="post.path" 
            class="post-item"
          >
            <div class="post-date">{{ formatDate(post.date) }}</div>
            <RouterLink 
              :to="post.path"
              class="post-title"
            >
              {{ post.title }}
            </RouterLink>
            <div class="post-meta">
              <span class="category">
                <i class="iconfont icon-folder"></i>
                {{ theme.categories?.[post.category] || post.category }}
              </span>
              <span class="separator">·</span>
              <span class="reading-time">
                {{ post.readingTime }} 分钟阅读
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import { formatDate } from '../utils'

const { theme } = useData()
const isHovering = ref(false)

// 按年份分组的文章
const groupedPosts = computed(() => {
  const groups: Record<string, any[]> = {}
  
  theme.value.posts?.forEach(post => {
    const year = new Date(post.date).getFullYear()
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(post)
  })
  
  // 对每个年份组内的文章按日期排序
  Object.keys(groups).forEach(year => {
    groups[year].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  })
  
  // 返回按年份倒序排列的对象
  return Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
  )
})

// 文章总数
const totalPosts = computed(() => theme.value.posts?.length || 0)
</script>

<style scoped>
.blog-archive {
  position: relative;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-archive:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--vp-c-brand);
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  inset: 0;
  overflow: hidden;
  opacity: 0.1;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: var(--vp-c-brand);
  transition: all 0.5s ease;
}

.circle-1 {
  width: 160px;
  height: 160px;
  top: -80px;
  right: -80px;
  opacity: 0.3;
}

.circle-2 {
  width: 120px;
  height: 120px;
  bottom: -60px;
  left: -60px;
  opacity: 0.2;
}

.is-hovering .circle-1 {
  transform: scale(1.2) translate(-10px, 10px);
}

.is-hovering .circle-2 {
  transform: scale(1.2) translate(10px, -10px);
}

/* 归档头部 */
.archive-header {
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
}

.archive-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.archive-stats {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

/* 时间线 */
.timeline {
  position: relative;
  z-index: 1;
}

.year-group {
  margin-bottom: 2rem;
}

.year-label {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  position: relative;
}

.year-label::before {
  content: '';
  position: absolute;
  left: -2rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  background: var(--vp-c-brand);
  border-radius: 50%;
  transform: translateY(-50%);
}

.posts-list {
  position: relative;
  padding-left: 2rem;
  border-left: 2px solid var(--vp-c-divider);
}

.post-item {
  position: relative;
  display: flex;
  gap: 1.5rem;
  padding: 1rem 0;
}

.post-item::before {
  content: '';
  position: absolute;
  left: -2.1rem;
  top: 1.5rem;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand);
  border: 2px solid var(--vp-c-bg);
  transition: all 0.3s ease;
}

.post-item:hover::before {
  transform: scale(1.2);
  box-shadow: 0 0 0 4px var(--vp-c-brand-dimm);
}

.post-date {
  flex-shrink: 0;
  text-align: center;
}

.post-title {
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}

.post-title:hover {
  color: var(--vp-c-brand);
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
}

.category {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

.category:hover {
  color: var(--vp-c-brand);
}

.separator {
  margin: 0 0.5rem;
}

.reading-time {
  color: var(--vp-c-text-2);
}

/* 深色模式优化 */
:root.dark .blog-archive {
  background: rgba(255, 255, 255, 0.03);
}

:root.dark .blog-archive:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

:root.dark .post-item::before {
  border-color: var(--vp-c-bg-soft);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-archive {
    padding: 1.5rem;
  }

  .archive-title {
    font-size: 1.3rem;
  }

  .posts-list {
    padding-left: 1.5rem;
  }

  .post-item {
    gap: 1rem;
  }

  .post-title {
    font-size: 1rem;
  }

  .post-meta {
    font-size: 0.85rem;
  }

  .year-label::before {
    left: -1.5rem;
    width: 0.8rem;
    height: 0.8rem;
  }

  .post-item {
    padding-left: 0.5rem;
  }

  .post-item::before {
    left: -1.2rem;
  }
}
</style> 
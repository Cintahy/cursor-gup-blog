<template>
  <article 
    class="blog-post-card"
    :class="{ 'is-hovering': isHovering }"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
    @click="handleCardClick"
  >
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 封面图 -->
    <div class="post-cover">
      <img :src="post.cover" :alt="post.title" loading="lazy">
    </div>

    <!-- 文章内容 -->
    <div class="post-content">
      <!-- 文章元信息 -->
      <div class="post-meta">
        <a
          v-if="post.category"
          class="category"
          @click="(e) => handleCategoryClick(e, post.category!)"
        >
          <i class="iconfont icon-folder"></i>
          {{ getCategoryText(post.category) }}
        </a>
        <time :datetime="post.date" class="date">
          <i class="iconfont icon-calendar"></i>
          {{ formatDate(post.date) }}
        </time>
      </div>

      <!-- 文章标题 -->
      <h2 class="post-title">{{ post.title }}</h2>

      <!-- 文章摘要 -->
      <p class="post-excerpt">{{ post.excerpt }}</p>

      <!-- 底部信息 -->
      <div class="post-footer">
        <div class="tags">
          <a
            v-for="tag in post.tags"
            :key="tag"
            class="tag"
            @click="(e) => handleTagClick(e, tag)"
          >
            <i class="iconfont icon-tag"></i>
            {{ tag }}
          </a>
        </div>
        <span class="read-more">
          阅读全文
          <i class="iconfont icon-arrow-right"></i>
        </span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useData, useRouter } from 'vitepress'
import { formatDate } from '../utils'

// 获取路由实例
const router = useRouter()
const { theme } = useData()
const isHovering = ref(false)

const props = defineProps<{
  post: {
    path: string
    title: string
    date: string
    excerpt?: string
    cover?: string
    tags?: string[]
    category?: string
  }
}>()

function getCategoryText(category: string) {
  return theme.value.categories?.[category] || category
}

// 处理卡片点击
function handleCardClick() {
  router.go(props.post.path)
}

// 处理分类点击
function handleCategoryClick(e: Event, category: string) {
  e.stopPropagation()
  router.go(`/categories/${category}/`)
}

// 处理标签点击
function handleTagClick(e: Event, tag: string) {
  e.stopPropagation()
  router.go(`/tags/${tag}/`)
}
</script>

<style scoped>
.blog-post-card {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-post-card:hover {
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
  width: 120px;
  height: 120px;
  top: -60px;
  right: -60px;
  opacity: 0.3;
}

.circle-2 {
  width: 80px;
  height: 80px;
  bottom: -40px;
  left: -40px;
  opacity: 0.2;
}

.is-hovering .circle-1 {
  transform: scale(1.2) translate(-10px, 10px);
}

.is-hovering .circle-2 {
  transform: scale(1.2) translate(10px, -10px);
}

/* 封面图 */
.post-cover {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* 文章内容 */
.post-content {
  position: relative;
  z-index: 1;
  padding: 1.5rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.category,
.date {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease;
}

.category:hover {
  color: var(--vp-c-brand);
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
  margin: 0 0 1rem;
  transition: color 0.2s ease;
}

.post-excerpt {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-mute);
  border-radius: 20px;
  transition: all 0.2s ease;
}

.tag:hover {
  color: white;
  background: var(--vp-c-brand);
  transform: translateY(-2px);
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: var(--vp-c-brand);
  transition: all 0.2s ease;
}

.read-more:hover {
  transform: translateX(4px);
}

/* 深色模式优化 */
:root.dark .blog-post-card {
  background: rgba(255, 255, 255, 0.03);
}

:root.dark .blog-post-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .post-content {
    padding: 1rem;
  }

  .post-title {
    font-size: 1.1rem;
  }

  .post-excerpt {
    font-size: 0.85rem;
    margin-bottom: 1rem;
  }

  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* 修改链接样式 */
.category,
.tag {
  position: relative;
  z-index: 2;
  cursor: pointer;
}
</style> 
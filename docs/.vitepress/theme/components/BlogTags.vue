<template>
  <div class="blog-tags">
    <!-- 标签概览 -->
    <div class="tags-overview">
      <div class="overview-card">
        <div class="overview-content">
          <div class="overview-header">
            <h1>标签</h1>
            <div class="overview-stats">
              <div class="stat-item">
                <div class="stat-value">{{ totalTags }}</div>
                <div class="stat-label">标签总数</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ totalPosts }}</div>
                <div class="stat-label">文章总数</div>
              </div>
            </div>
          </div>
          <div class="tags-cloud">
            <div
              v-for="tag in sortedTags"
              :key="tag.name"
              class="tag-item"
              :class="{ active: currentTag === tag.name }"
              @click="selectTag(tag.name)"
            >
              <span class="tag-name">{{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="posts-section" v-if="currentTag">
      <div class="section-header">
        <h2>
          <span class="tag-label">{{ currentTag }}</span>
          <span class="post-count">{{ getCurrentTagPosts.length }} 篇文章</span>
        </h2>
      </div>
      
      <div class="posts-grid">
        <a
          v-for="post in getCurrentTagPosts"
          :key="post.path"
          :href="withBase(post.path)"
          class="post-card"
        >
          <div class="post-cover">
            <img :src="withBase(post.cover)" :alt="post.title">
          </div>
          <div class="post-content">
            <h3 class="post-title">{{ post.title }}</h3>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-meta">
              <span class="post-date">
                <i class="iconfont icon-calendar"></i>
                {{ formatDate(post.date) }}
              </span>
              <span class="reading-time">
                <i class="iconfont icon-time"></i>
                {{ post.readingTime }} 分钟阅读
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- 空状态提示 -->
    <div v-else class="empty-state">
      <i class="iconfont icon-tag empty-icon"></i>
      <p>请选择一个标签以查看相关文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { formatDate } from '../utils'

const { theme } = useData()
const currentTag = ref('')

// 计算标签数据
const sortedTags = computed(() => {
  const tagMap = new Map()
  
  theme.value.posts?.forEach(post => {
    post.tags?.forEach(tag => {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, {
          name: tag,
          count: 0,
          posts: []
        })
      }
      const tagData = tagMap.get(tag)
      tagData.count++
      tagData.posts.push(post)
    })
  })
  
  return Array.from(tagMap.values())
    .sort((a, b) => b.count - a.count)
})

const totalTags = computed(() => sortedTags.value.length)
const totalPosts = computed(() => theme.value.posts?.length || 0)

const getCurrentTagPosts = computed(() => {
  const tag = sortedTags.value.find(t => t.name === currentTag.value)
  return tag?.posts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ) || []
})

function selectTag(tagName: string) {
  currentTag.value = tagName
  setTimeout(() => {
    document.querySelector('.posts-section')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }, 100)
}
</script>

<style scoped>
.blog-tags {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 概览卡片 */
.overview-card {
  background: var(--vp-c-bg-soft);
  border-radius: 24px;
  padding: 2rem;
  margin-bottom: 3rem;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.overview-header h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
  background: linear-gradient(to right, var(--vp-c-brand), var(--vp-c-brand-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.overview-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--vp-c-brand);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

/* 标签云 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.tag-item {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  transition: all 0.3s ease;
  user-select: none;
}

.tag-item:hover {
  transform: translateY(-2px);
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand);
}

.tag-item.active {
  background: var(--vp-c-brand);
  color: white;
}

.tag-count {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* 文章列表 */
.posts-section {
  margin-top: 3rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0;
}

.tag-label {
  font-size: 1.5rem;
  color: var(--vp-c-brand);
}

.post-count {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  font-weight: normal;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-card {
  display: block;
  text-decoration: none;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  color: inherit;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.post-card:active {
  transform: translateY(0);
  opacity: 0.8;
}

.post-cover {
  aspect-ratio: 16/9;
  overflow: hidden;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  font-size: 1.2rem;
  margin: 0 0 0.8rem;
  color: var(--vp-c-text-1);
}

.post-excerpt {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0 0 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-2);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* 深色模式 */
:root.dark .post-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .blog-tags {
    padding: 1rem;
  }

  .overview-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .overview-stats {
    width: 100%;
    justify-content: space-around;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 
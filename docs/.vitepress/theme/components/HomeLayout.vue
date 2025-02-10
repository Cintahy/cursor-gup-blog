<template>
  <div class="home-container">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 个人简介卡片 -->
      <div class="profile-section">
        <div class="profile-card">
          <div class="profile-avatar">
            <img :src="theme.profile.avatar" :alt="theme.profile.name">
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ theme.profile.name }}</h1>
            <div class="profile-bio">
              <TypeWriter 
                :texts="theme.profile.description"
                :interval="3000"
                :typeSpeed="80"
              />
            </div>
            <div class="profile-social">
              <a 
                v-for="(url, platform) in theme.profile.social"
                :key="platform"
                :href="url"
                class="social-link"
                :title="platform"
                target="_blank"
              >
                <i :class="getSocialIcon(platform)"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计数据 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalPosts }}</div>
          <div class="stat-label">文章</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalCategories }}</div>
          <div class="stat-label">分类</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalTags }}</div>
          <div class="stat-label">标签</div>
        </div>
      </div>

      <!-- 分类导航 -->
      <div class="categories-section">
        <h2 class="section-title">文章分类</h2>
        <div class="categories-grid">
          <RouterLink
            v-for="category in categories"
            :key="category.name"
            :to="`/categories/${category.name}/`"
            class="category-card"
          >
            <div class="category-icon">
              <i :class="getCategoryIcon(category.name)"></i>
            </div>
            <div class="category-info">
              <span class="category-name">{{ category.text }}</span>
              <span class="post-count">{{ category.count }} 篇文章</span>
            </div>
          </RouterLink>
        </div>
      </div>

      <!-- 最新文章 -->
      <div class="latest-posts-section">
        <div class="section-header">
          <h2 class="section-title">最新文章</h2>
          <RouterLink to="/posts" class="view-more">
            查看全部
            <i class="iconfont icon-arrow-right"></i>
          </RouterLink>
        </div>
        <div class="posts-grid">
          <BlogPostCard 
            v-for="post in latestPosts" 
            :key="post.path" 
            :post="post"
          />
        </div>
      </div>
    </div>

    <!-- 侧边栏 -->
    <aside class="sidebar">
      <!-- 时间进度卡片 -->
      <div class="progress-card">
        <BlogStats />
      </div>

      <!-- 标签云 -->
      <div class="tags-card">
        <h3 class="card-title">热门标签</h3>
        <div class="tags-cloud">
          <RouterLink
            v-for="tag in popularTags"
            :key="tag.name"
            :to="`/tags/${tag.name}/`"
            class="tag-item"
            :style="getTagStyle(tag.count)"
          >
            {{ tag.name }}
            <span class="tag-count">{{ tag.count }}</span>
          </RouterLink>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.home-container {
  max-width: var(--vp-layout-max-width);
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 2rem;
}

/* 个人简介卡片 */
.profile-card {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  margin-bottom: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--vp-c-brand);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, var(--vp-c-brand), var(--vp-c-brand-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.profile-bio {
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  min-height: 3em;
}

.profile-social {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  transition: all 0.3s;
}

.social-link:hover {
  background: var(--vp-c-brand);
  color: white;
  transform: translateY(-2px);
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--vp-c-brand);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

/* 分类部分 */
.categories-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--vp-c-text-1);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  transition: all 0.3s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-dimm);
  border-radius: 12px;
  font-size: 1.5rem;
  color: var(--vp-c-brand);
}

.category-info {
  flex: 1;
}

.category-name {
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.post-count {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

/* 最新文章部分 */
.latest-posts-section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-more {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--vp-c-brand);
  font-size: 0.9rem;
  transition: all 0.3s;
}

.view-more:hover {
  transform: translateX(4px);
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

/* 侧边栏 */
.sidebar {
  position: sticky;
  top: calc(var(--vp-nav-height) + 24px);
  height: fit-content;
}

.progress-card,
.tags-card {
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--vp-c-text-1);
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  transition: all 0.3s;
}

.tag-item:hover {
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand);
  transform: translateY(-2px);
}

.tag-count {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 深色模式优化 */
:root.dark .profile-card,
:root.dark .stat-card,
:root.dark .category-card,
:root.dark .progress-card,
:root.dark .tags-card {
  background: rgba(255, 255, 255, 0.03);
}

:root.dark .stat-card:hover,
:root.dark .category-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* 移动端适配 */
@media (max-width: 1024px) {
  .home-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    margin-top: 2rem;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .profile-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    padding: 1.5rem;
  }

  .profile-social {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import TypeWriter from './TypeWriter.vue'
import BlogPostCard from './BlogPostCard.vue'
import BlogStats from './BlogStats.vue'

const { theme } = useData()

// 统计数据
const totalPosts = computed(() => theme.value.posts?.length || 0)
const totalCategories = computed(() => Object.keys(theme.value.categories || {}).length)
const totalTags = computed(() => {
  const tags = new Set()
  theme.value.posts?.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag))
  })
  return tags.size
})

// 分类数据
const categories = computed(() => {
  const categoryMap = new Map()
  
  Object.entries(theme.value.categories || {}).forEach(([name, text]) => {
    categoryMap.set(name, {
      name,
      text,
      count: 0
    })
  })
  
  theme.value.posts?.forEach(post => {
    if (post.category && categoryMap.has(post.category)) {
      categoryMap.get(post.category).count++
    }
  })
  
  return Array.from(categoryMap.values())
})

// 最新文章
const latestPosts = computed(() => {
  const posts = theme.value.posts || []
  return posts
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)
})

// 热门标签
const popularTags = computed(() => {
  const tagMap = new Map()
  
  theme.value.posts?.forEach(post => {
    post.tags?.forEach(tag => {
      const count = tagMap.get(tag) || 0
      tagMap.set(tag, count + 1)
    })
  })
  
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
})

// 工具函数
function getSocialIcon(platform: string) {
  const icons: Record<string, string> = {
    github: 'iconfont icon-github',
    twitter: 'iconfont icon-twitter',
    email: 'iconfont icon-email'
  }
  return icons[platform]
}

function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    tech: 'iconfont icon-code',
    life: 'iconfont icon-life',
    growth: 'iconfont icon-growth'
  }
  return icons[category] || 'iconfont icon-folder'
}

function getTagStyle(count: number) {
  const max = Math.max(...popularTags.value.map(t => t.count))
  const min = Math.min(...popularTags.value.map(t => t.count))
  const fontSize = 0.8 + (count - min) / (max - min) * 0.4
  
  return {
    fontSize: `${fontSize}rem`
  }
}
</script> 
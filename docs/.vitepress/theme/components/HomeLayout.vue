<template>
  <div class="home-container">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 分类导航 -->
      <div class="categories-section">
        <div class="section-header">
          <h2 class="section-title">文章分类</h2>
          <a href="/categories" class="view-more">
            查看全部
            <i class="iconfont icon-arrow-right"></i>
          </a>
        </div>
        <div class="categories-grid">
          <RouterLink
            v-for="category in categories"
            :key="category.name"
            :to="`/categories/${category.name}/`"
            class="category-card"
          >
            <i :class="getCategoryIcon(category.name)" class="category-icon"></i>
            <div class="category-info">
              <span class="category-name">{{ category.text }}</span>
              <span class="post-count">{{ category.count }} 篇</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- 右侧边栏 -->
    <aside class="sidebar">
      <!-- 个人信息卡片 -->
      <div class="profile-section">
        <BlogSiteInfo />
      </div>

      <!-- 统计卡片组 -->
      <div class="stats-section">
        <BlogStats />
      </div>
    </aside>

    <!-- 返回顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import BlogStats from './BlogStats.vue'
import BlogSiteInfo from './BlogSiteInfo.vue'
import BackToTop from './BackToTop.vue'

const { theme } = useData()

// 获取分类数据
const categories = computed(() => {
  const categoryMap = new Map()
  
  // 初始化分类
  Object.entries(theme.value.categories || {}).forEach(([name, text]) => {
    categoryMap.set(name, {
      name,
      text,
      count: 0
    })
  })
  
  // 统计文章数
  theme.value.posts?.forEach(post => {
    if (post.category && categoryMap.has(post.category)) {
      categoryMap.get(post.category).count++
    }
  })
  
  return Array.from(categoryMap.values())
})

// 获取分类图标
function getCategoryIcon(name: string) {
  const icons: Record<string, string> = {
    tech: 'iconfont icon-code',
    life: 'iconfont icon-heart',
    growth: 'iconfont icon-rocket'
  }
  return icons[name] || 'iconfont icon-folder'
}
</script>

<style scoped>
.home-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 2rem;
}

.sidebar {
  position: sticky;
  top: calc(var(--vp-nav-height) + 24px);
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.main-content {
  min-width: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  letter-spacing: -0.5px;
}

.view-more {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
}

.view-more:hover {
  color: var(--vp-c-brand);
  transform: translateX(4px);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 1.5rem;
  color: var(--vp-c-brand);
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-brand-dimm);
  border-radius: 12px;
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.category-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.post-count {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
}

/* 深色模式优化 */
:root.dark .category-card {
  background: rgba(255, 255, 255, 0.02);
}

:root.dark .category-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 移动端适配 */
@media (max-width: 1024px) {
  .home-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    order: -1;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .category-card {
    padding: 1rem;
  }

  .category-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
}
</style> 
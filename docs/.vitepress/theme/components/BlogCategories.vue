<template>
  <div class="blog-categories" :class="{ 'is-hovering': isHovering }" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
    </div>

    <!-- 分类标题 -->
    <div class="categories-header">
      <h2 class="section-title">文章分类</h2>
      <span class="category-count">{{ Object.keys(categories).length }} 个分类</span>
    </div>

    <!-- 分类列表 -->
    <div class="categories-grid">
      <a
        v-for="(text, name) in categories"
        :key="name"
        :href="`/categories/${name}/`"
        class="category-card"
      >
        <div class="category-icon">
          <i :class="getCategoryIcon(name)"></i>
        </div>
        <div class="category-info">
          <h3 class="category-name">{{ text }}</h3>
          <span class="post-count">
            {{ getCategoryPostCount(name) }} 篇文章
          </span>
        </div>
        <div class="category-arrow">
          <i class="iconfont icon-arrow-right"></i>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { theme } = useData()
const isHovering = ref(false)

const categories = computed(() => theme.value.categories || {})

// 获取分类图标
function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    tech: 'iconfont icon-code',
    life: 'iconfont icon-life',
    growth: 'iconfont icon-growth',
    default: 'iconfont icon-folder'
  }
  return icons[category] || icons.default
}

// 获取分类文章数
function getCategoryPostCount(category: string) {
  return theme.value.posts?.filter(post => post.category === category).length || 0
}
</script>

<style scoped>
.blog-categories {
  position: relative;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-categories:hover {
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

/* 分类头部 */
.categories-header {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0;
}

.category-count {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

/* 分类网格 */
.categories-grid {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.category-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--vp-c-bg-mute);
  border-radius: 12px;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
}

.category-card:hover {
  transform: translateY(-2px);
  background: var(--vp-c-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
}

.category-card:hover .category-icon {
  background: var(--vp-c-brand);
  color: white;
  transform: scale(1.1);
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin: 0 0 0.25rem;
}

.post-count {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.category-arrow {
  color: var(--vp-c-text-2);
  transition: transform 0.3s ease;
}

.category-card:hover .category-arrow {
  transform: translateX(4px);
  color: var(--vp-c-brand);
}

/* 深色模式优化 */
:root.dark .blog-categories {
  background: rgba(255, 255, 255, 0.03);
}

:root.dark .blog-categories:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

:root.dark .category-card {
  background: rgba(255, 255, 255, 0.04);
}

:root.dark .category-card:hover {
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-categories {
    padding: 1rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .category-card {
    padding: 0.75rem;
  }

  .category-icon {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .category-name {
    font-size: 0.95rem;
  }
}
</style> 
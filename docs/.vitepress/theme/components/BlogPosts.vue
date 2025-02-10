<template>
  <div class="blog-posts">
    <!-- 筛选工具栏 -->
    <div class="posts-toolbar">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索文章..."
          class="search-input"
        >
        <i class="iconfont icon-search"></i>
      </div>

      <div class="filter-group">
        <div class="filter-item">
          <select v-model="selectedCategory" class="filter-select">
            <option value="">全部分类</option>
            <option 
              v-for="(text, name) in categories"
              :key="name"
              :value="name"
            >
              {{ text }}
            </option>
          </select>
        </div>

        <div class="filter-item">
          <select v-model="sortBy" class="filter-select">
            <option value="date-desc">最新发布</option>
            <option value="date-asc">最早发布</option>
          </select>
        </div>

        <div class="view-switch">
          <button 
            class="view-btn"
            :class="{ active: viewMode === 'grid' }"
            @click="viewMode = 'grid'"
          >
            <i class="iconfont icon-grid"></i>
          </button>
          <button 
            class="view-btn"
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            <i class="iconfont icon-list"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- 文章列表 -->
    <TransitionGroup 
      :name="viewMode === 'grid' ? 'posts-grid' : 'posts-list'"
      tag="div"
      class="posts-container"
      :class="viewMode"
    >
      <div
        v-for="post in filteredPosts"
        :key="post.path"
        class="post-item"
        @click="handlePostClick(post.path)"
      >
        <!-- 网格视图 -->
        <template v-if="viewMode === 'grid'">
          <div class="post-cover">
            <img :src="post.cover" :alt="post.title">
            <div class="post-meta">
              <span class="post-category">
                <i class="iconfont icon-folder"></i>
                {{ getCategoryText(post.category) }}
              </span>
              <span class="post-date">
                <i class="iconfont icon-calendar"></i>
                {{ formatDate(post.date) }}
              </span>
            </div>
          </div>
          <div class="post-content">
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-footer">
              <div class="post-tags">
                <span 
                  v-for="tag in post.tags"
                  :key="tag"
                  class="post-tag"
                >
                  {{ tag }}
                </span>
              </div>
              <span class="read-more">
                阅读全文
                <i class="iconfont icon-arrow-right"></i>
              </span>
            </div>
          </div>
        </template>

        <!-- 列表视图 -->
        <template v-else>
          <div class="post-content">
            <div class="post-meta">
              <span class="post-category">
                {{ getCategoryText(post.category) }}
              </span>
              <span class="post-date">{{ formatDate(post.date) }}</span>
            </div>
            <h2 class="post-title">{{ post.title }}</h2>
            <p class="post-excerpt">{{ post.excerpt }}</p>
            <div class="post-footer">
              <div class="post-tags">
                <span 
                  v-for="tag in post.tags"
                  :key="tag"
                  class="post-tag"
                >
                  {{ tag }}
                </span>
              </div>
              <span class="read-time">
                {{ post.readingTime }} 分钟阅读
              </span>
            </div>
          </div>
          <div class="post-cover">
            <img :src="post.cover" :alt="post.title">
          </div>
        </template>
      </div>
    </TransitionGroup>

    <!-- 无文章提示 -->
    <div v-if="!filteredPosts.length" class="no-posts">
      <i class="iconfont icon-empty"></i>
      <p>暂无相关文章</p>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <button 
        class="load-more-btn"
        :class="{ loading: isLoading }"
        @click="loadMore"
      >
        <i class="iconfont icon-loading"></i>
        {{ isLoading ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import BlogPostCard from './BlogPostCard.vue'
import { formatDate } from '../utils'

const { theme } = useData()

// 视图模式
const viewMode = ref('grid')
const selectedCategory = ref('')
const sortBy = ref('date-desc')
const pageSize = 12
const currentPage = ref(1)
const isLoading = ref(false)

// 获取分类文本
function getCategoryText(category: string) {
  return theme.value.categories?.[category] || category
}

// 搜索和筛选
const searchQuery = ref('')
const categories = computed(() => theme.value.categories || {})

// 过滤和排序文章
const filteredPosts = computed(() => {
  let posts = theme.value.posts || []
  
  // 分类筛选
  if (selectedCategory.value) {
    posts = posts.filter(post => post.category === selectedCategory.value)
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    posts = posts.filter(post => 
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // 排序
  posts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortBy.value === 'date-desc' ? dateB - dateA : dateA - dateB
  })
  
  return posts.slice(0, currentPage.value * pageSize)
})

// 是否还有更多文章
const hasMore = computed(() => {
  const total = theme.value.posts?.length || 0
  return currentPage.value * pageSize < total
})

// 加载更多
async function loadMore() {
  if (isLoading.value) return
  isLoading.value = true
  
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  currentPage.value++
  isLoading.value = false
}

// 处理文章点击
function handlePostClick(path: string) {
  window.location.href = path
}

// 处理图片预览
function handlePreviewImage(src: string) {
  // 触发图片预览事件
  window.$imagePreview?.open(src)
}
</script>

<style scoped>
.blog-posts {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 工具栏样式 */
.posts-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.search-bar {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  border: none;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.95rem;
  transition: all 0.3s;
}

.search-input:focus {
  background: var(--vp-c-bg-mute);
  outline: none;
}

.search-bar i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--vp-c-text-2);
}

.filter-group {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.filter-select {
  padding: 0.6rem 2rem 0.6rem 1rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  background: var(--vp-c-bg-mute);
}

.view-switch {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.3s;
}

.view-btn:hover,
.view-btn.active {
  background: var(--vp-c-brand);
  color: white;
}

/* 文章列表样式 */
.posts-container {
  display: grid;
  gap: 2rem;
}

.posts-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.posts-container.list {
  grid-template-columns: 1fr;
}

.post-item {
  position: relative;
  background: var(--vp-c-bg-soft);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.post-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* 网格视图样式 */
.posts-container.grid .post-cover {
  position: relative;
  aspect-ratio: 16/9;
}

.posts-container.grid .post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.posts-container.grid .post-item:hover .post-cover img {
  transform: scale(1.05);
}

.posts-container.grid .post-meta {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  color: white;
  display: flex;
  justify-content: space-between;
}

.posts-container.grid .post-content {
  padding: 1.5rem;
}

/* 列表视图样式 */
.posts-container.list .post-item {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  padding: 1.5rem;
}

.posts-container.list .post-cover {
  order: 2;
  border-radius: 12px;
  overflow: hidden;
}

.posts-container.list .post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.posts-container.list .post-content {
  order: 1;
  display: flex;
  flex-direction: column;
}

/* 共用样式 */
.post-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0.8rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.post-excerpt {
  color: var(--vp-c-text-2);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.post-tag {
  padding: 0.2rem 0.6rem;
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand);
  border-radius: 20px;
  font-size: 0.8rem;
}

.read-more {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--vp-c-brand);
  font-size: 0.9rem;
  transition: transform 0.3s;
}

.post-item:hover .read-more {
  transform: translateX(4px);
}

/* 加载更多按钮 */
.load-more {
  text-align: center;
  margin-top: 3rem;
}

.load-more-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-btn:hover {
  background: var(--vp-c-brand-light);
  transform: translateY(-2px);
}

.load-more-btn.loading {
  opacity: 0.8;
  cursor: wait;
}

.load-more-btn i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 深色模式优化 */
:root.dark .post-item {
  background: rgba(255, 255, 255, 0.03);
}

:root.dark .post-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-posts {
    padding: 1rem;
  }

  .posts-toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-bar {
    max-width: none;
  }

  .filter-group {
    flex-wrap: wrap;
  }

  .posts-container.list .post-item {
    grid-template-columns: 1fr;
  }

  .posts-container.list .post-cover {
    order: 1;
    aspect-ratio: 16/9;
  }

  .posts-container.list .post-content {
    order: 2;
  }
}
</style> 
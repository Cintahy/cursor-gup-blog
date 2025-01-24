<template>
  <div class="blog-posts">
    <!-- 筛选工具栏 -->
    <div class="posts-toolbar">
      <div class="view-switch">
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
          title="网格视图"
        >
          <i class="iconfont icon-grid"></i>
        </button>
        <button 
          class="view-btn"
          :class="{ active: viewMode === 'list' }"
          @click="viewMode = 'list'"
          title="列表视图"
        >
          <i class="iconfont icon-list"></i>
        </button>
      </div>

      <div class="filter-group">
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

        <select v-model="sortBy" class="filter-select">
          <option value="date-desc">最新发布</option>
          <option value="date-asc">最早发布</option>
        </select>
      </div>
    </div>

    <!-- 文章列表 -->
    <TransitionGroup 
      :name="viewMode === 'grid' ? 'posts-grid' : 'posts-list'"
      tag="div"
      class="posts-container"
      :class="viewMode"
    >
      <BlogPostCard
        v-for="post in filteredPosts"
        :key="post.path"
        :post="post"
        @preview-image="handlePreviewImage"
      />
    </TransitionGroup>

    <!-- 无文章提示 -->
    <div v-if="!filteredPosts.length" class="no-posts">
      <i class="iconfont icon-empty"></i>
      <p>暂无相关文章</p>
    </div>

    <!-- 加载更多 -->
    <div v-if="hasMore" class="load-more">
      <button class="load-more-btn" @click="loadMore">
        <i class="iconfont icon-loading" :class="{ loading: isLoading }"></i>
        {{ isLoading ? '加载中...' : '加载更多' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import BlogPostCard from './BlogPostCard.vue'

const { theme } = useData()

// 视图模式
const viewMode = ref('grid')
const selectedCategory = ref('')
const sortBy = ref('date-desc')
const pageSize = 12
const currentPage = ref(1)
const isLoading = ref(false)

// 获取所有文章
const allPosts = computed(() => theme.value.posts || [])

// 分类数据
const categories = computed(() => theme.value.categories || {})

// 过滤和排序文章
const filteredPosts = computed(() => {
  let posts = [...allPosts.value]

  // 分类过滤
  if (selectedCategory.value) {
    posts = posts.filter(post => post.category === selectedCategory.value)
  }

  // 排序
  posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime()
    const dateB = new Date(b.date).getTime()
    return sortBy.value === 'date-desc' ? dateB - dateA : dateA - dateB
  })

  // 分页
  return posts.slice(0, currentPage.value * pageSize)
})

// 是否还有更多
const hasMore = computed(() => {
  const total = selectedCategory.value
    ? allPosts.value.filter(post => post.category === selectedCategory.value).length
    : allPosts.value.length
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
  transition: all 0.2s ease;
}

.view-btn:hover,
.view-btn.active {
  background: var(--vp-c-brand);
  color: white;
}

.filter-group {
  display: flex;
  gap: 1rem;
}

.filter-select {
  padding: 0.5rem 2rem 0.5rem 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:hover {
  border-color: var(--vp-c-brand);
}

/* 文章列表容器 */
.posts-container {
  display: grid;
  gap: 2rem;
}

.posts-container.grid {
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.posts-container.list {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* 无文章提示 */
.no-posts {
  text-align: center;
  padding: 4rem 0;
  color: var(--vp-c-text-2);
}

.no-posts i {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* 加载更多 */
.load-more {
  text-align: center;
  margin-top: 3rem;
}

.load-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-more-btn:hover {
  background: var(--vp-c-brand);
  border-color: var(--vp-c-brand);
  color: white;
}

.icon-loading {
  display: inline-block;
  animation: none;
}

.icon-loading.loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 列表动画 */
.posts-grid-move,
.posts-list-move {
  transition: all 0.5s ease;
}

.posts-grid-enter-active,
.posts-grid-leave-active,
.posts-list-enter-active,
.posts-list-leave-active {
  transition: all 0.5s ease;
}

.posts-grid-enter-from,
.posts-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.posts-list-enter-from,
.posts-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* 深色模式优化 */
:root.dark .view-btn {
  background: rgba(255, 255, 255, 0.04);
}

:root.dark .filter-select {
  background: rgba(255, 255, 255, 0.04);
  border-color: var(--vp-c-divider);
}

:root.dark .load-more-btn {
  background: rgba(255, 255, 255, 0.04);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .blog-posts {
    padding: 1rem;
  }

  .posts-toolbar {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .posts-container.grid {
    grid-template-columns: 1fr;
  }
}
</style> 
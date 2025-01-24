<template>
  <div class="blog-search" :class="{ 'is-active': isActive }">
    <!-- 搜索输入框 -->
    <div class="search-input-wrap">
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索文章..."
        @focus="isActive = true"
        @blur="handleBlur"
        @keydown.esc="clearSearch"
        @keydown.enter="handleEnter"
        @keydown.up.prevent="handleUp"
        @keydown.down.prevent="handleDown"
      >
      <div class="search-icons">
        <i 
          v-if="searchQuery" 
          class="iconfont icon-close clear-icon"
          @click="clearSearch"
        ></i>
        <i class="iconfont icon-search search-icon"></i>
      </div>
    </div>

    <!-- 搜索结果 -->
    <div v-show="isActive && searchResults.length > 0" class="search-results">
      <div 
        v-for="(result, index) in searchResults" 
        :key="result.path"
        class="result-item"
        :class="{ 'is-selected': index === selectedIndex }"
        @mouseenter="selectedIndex = index"
        @click="handleSelect(result)"
      >
        <div class="result-title">
          <i class="iconfont icon-article"></i>
          <span v-html="highlightQuery(result.title)"></span>
        </div>
        <div v-if="result.excerpt" class="result-excerpt" v-html="highlightQuery(result.excerpt)"></div>
        <div class="result-meta">
          <span class="date">
            <i class="iconfont icon-calendar"></i>
            {{ formatDate(result.date) }}
          </span>
          <span v-if="result.category" class="category">
            <i class="iconfont icon-folder"></i>
            {{ getCategoryText(result.category) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 无结果提示 -->
    <div v-if="isActive && searchQuery && !searchResults.length" class="no-results">
      <i class="iconfont icon-empty"></i>
      <p>未找到相关文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import { formatDate } from '../utils'

const { theme } = useData()
const router = useRouter()
const inputRef = ref<HTMLInputElement>()
const isActive = ref(false)
const searchQuery = ref('')
const selectedIndex = ref(0)

// 搜索结果
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase()
  return (theme.value.posts || [])
    .filter(post => {
      const searchContent = [
        post.title,
        post.excerpt,
        post.category,
        ...(post.tags || [])
      ].join(' ').toLowerCase()
      
      return searchContent.includes(query)
    })
    .slice(0, 10) // 限制结果数量
})

// 监听搜索词变化，重置选中项
watch(searchQuery, () => {
  selectedIndex.value = 0
})

// 处理快捷键
function handleHotkey(e: KeyboardEvent) {
  if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    inputRef.value?.focus()
  }
}

// 高亮搜索词
function highlightQuery(text: string) {
  if (!searchQuery.value) return text
  const query = searchQuery.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${query})`, 'gi'),
    '<mark>$1</mark>'
  )
}

// 处理选择
function handleSelect(result: any) {
  router.go(result.path)
  clearSearch()
}

// 处理回车
function handleEnter() {
  if (searchResults.value[selectedIndex.value]) {
    handleSelect(searchResults.value[selectedIndex.value])
  }
}

// 处理上下键
function handleUp() {
  selectedIndex.value = selectedIndex.value > 0
    ? selectedIndex.value - 1
    : searchResults.value.length - 1
}

function handleDown() {
  selectedIndex.value = selectedIndex.value < searchResults.value.length - 1
    ? selectedIndex.value + 1
    : 0
}

// 清空搜索
function clearSearch() {
  searchQuery.value = ''
  isActive.value = false
}

// 处理失焦
function handleBlur() {
  setTimeout(() => {
    isActive.value = false
  }, 200)
}

// 获取分类文本
function getCategoryText(category: string) {
  return theme.value.categories?.[category] || category
}

// 注册快捷键
onMounted(() => {
  window.addEventListener('keydown', handleHotkey)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleHotkey)
})
</script>

<style scoped>
.blog-search {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-wrap {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--vp-c-brand);
  box-shadow: 0 0 0 3px var(--vp-c-brand-dimm);
}

.search-icons {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-icon,
.clear-icon {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s ease;
}

.clear-icon:hover {
  color: var(--vp-c-text-1);
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.result-item {
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.result-item.is-selected,
.result-item:hover {
  background: var(--vp-c-bg-mute);
}

.result-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  margin-bottom: 0.25rem;
}

.result-excerpt {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.date,
.category {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.no-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  padding: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-align: center;
  color: var(--vp-c-text-2);
}

.no-results i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

:deep(mark) {
  background: var(--vp-c-brand-dimm);
  color: var(--vp-c-brand-dark);
  padding: 0 0.25em;
  border-radius: 2px;
}

/* 深色模式优化 */
:root.dark .search-results,
:root.dark .no-results {
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .search-input {
    font-size: 0.9rem;
    padding: 0.6rem 2.25rem 0.6rem 0.75rem;
  }

  .search-results {
    max-height: 300px;
  }

  .result-item {
    padding: 0.6rem;
  }
}
</style> 
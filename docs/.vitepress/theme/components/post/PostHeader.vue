<template>
  <header class="post-header" :style="coverStyle">
    <div class="header-content">
      <!-- 分类和日期 -->
      <div class="meta-top">
        <a 
          v-if="frontmatter.category"
          :href="`/categories/${frontmatter.category}/`"
          class="category"
        >
          <i class="iconfont icon-folder"></i>
          {{ getCategoryText(frontmatter.category) }}
        </a>
        <time :datetime="frontmatter.date" class="date">
          <i class="iconfont icon-calendar"></i>
          {{ formatDate(frontmatter.date) }}
        </time>
      </div>

      <!-- 文章标题 -->
      <h1 class="title">{{ frontmatter.title }}</h1>
      
      <!-- 文章描述 -->
      <p v-if="frontmatter.description" class="desc">
        {{ frontmatter.description }}
      </p>

      <!-- 文章标签 -->
      <div v-if="frontmatter.tags?.length" class="tags">
        <a 
          v-for="tag in frontmatter.tags"
          :key="tag"
          :href="`/tags/${tag}/`"
          class="tag"
        >
          <i class="iconfont icon-tag"></i>
          {{ tag }}
        </a>
      </div>

      <!-- 文章元信息 -->
      <div class="meta-bottom">
        <div class="meta-item">
          <i class="iconfont icon-user"></i>
          <span>{{ frontmatter.author || site.title }}</span>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <i class="iconfont icon-time"></i>
          <span>{{ readingTime }} 分钟阅读</span>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <i class="iconfont icon-eye"></i>
          <span>{{ pageViews }} 次阅读</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '../../utils'
import { useData } from 'vitepress'
import LazyImage from '../LazyImage.vue'

const { theme } = useData()
const props = defineProps<{
  frontmatter: any
  site: any
  pageViews: number
  readingTime: number
  wordCount: number
}>()

defineEmits<{
  (e: 'preview-image', src: string, alt?: string): void
}>()

// 计算封面背景样式
const coverStyle = computed(() => ({
  backgroundImage: props.frontmatter.cover ? `url(${props.frontmatter.cover})` : 'none'
}))

// 获取分类文本
function getCategoryText(category: string) {
  return theme.value.categories?.[category] || category
}

function formatWordCount(count: number) {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}w 字`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k 字`
  }
  return `${count} 字`
}
</script>

<style scoped>
.post-header {
  position: relative;
  margin: -1rem -24px 2rem;
  padding: 2.5rem 1.5rem;
  background-color: var(--vp-c-bg-soft);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: var(--vp-c-text-1);
  text-align: center;
  overflow: hidden;
}

/* 有封面图时的样式 */
.post-header[style*="background-image"]::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(10px);
  transform: scale(1.1);
}

.post-header[style*="background-image"]::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4),
    rgba(0, 0, 0, 0.6)
  );
}

.post-header[style*="background-image"] {
  color: white;
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.meta-top {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.category {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.category:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.date {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  opacity: 0.9;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.8rem;
  letter-spacing: -0.5px;
}

.desc {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
  margin: 0.8rem auto;
  max-width: 600px;
}

.tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 1rem 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.6rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.tag:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.meta-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1.2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.meta-divider {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.3;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .post-header {
    margin: -1rem -16px 1.5rem;
    padding: 2rem 1rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .desc {
    font-size: 0.9rem;
  }

  .meta-bottom {
    flex-direction: column;
    gap: 0.8rem;
  }

  .meta-divider {
    display: none;
  }
}
</style> 
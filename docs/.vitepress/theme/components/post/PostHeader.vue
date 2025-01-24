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
          {{ frontmatter.category }}
        </a>
        <time :datetime="frontmatter.date" class="date">
          <i class="iconfont icon-calendar"></i>
          {{ formatDate(frontmatter.date) }}
        </time>
      </div>

      <!-- 文章标题 -->
      <h1 class="title">{{ frontmatter.title }}</h1>
      
      <!-- 文章描述 -->
      <p class="desc" v-if="frontmatter.description">
        {{ frontmatter.description }}
      </p>

      <!-- 文章标签 -->
      <div class="tags" v-if="frontmatter.tags?.length">
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
import LazyImage from '../LazyImage.vue'

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
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: white;
  text-align: center;
  overflow: hidden;
  border-radius: 0 0 32px 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 毛玻璃背景 */
.post-header::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  filter: blur(12px);
  transform: scale(1.1);
}

/* 暗色遮罩 - 使用渐变 */
.post-header::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0.4) 100%
  );
  backdrop-filter: blur(4px);
}

.header-content {
  position: relative;
  z-index: 1;
  max-width: 680px;
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
  gap: 0.3rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: var(--vp-c-brand);
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.category:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.date {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  opacity: 0.95;
  font-weight: 500;
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.8rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
  background: linear-gradient(
    120deg,
    #fff 0%,
    rgba(255, 255, 255, 0.9) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.desc {
  font-size: 1.05rem;
  margin: 0.8rem auto;
  max-width: 540px;
  line-height: 1.6;
  opacity: 0.9;
  font-weight: 500;
}

.tags {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1.2rem 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.7rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.tag:hover {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.meta-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  opacity: 0.95;
  font-weight: 500;
}

.meta-divider {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}

.meta-item .iconfont {
  font-size: 1rem;
}

/* 无封面时的样式 */
.post-header:not([style*="background-image"]) {
  background: linear-gradient(
    135deg,
    var(--vp-c-brand) 0%,
    var(--vp-c-brand-light) 100%
  );
  padding: 2.5rem 1.5rem;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .post-header {
    margin: -1rem -16px 1.5rem;
    padding: 2rem 1rem;
    border-radius: 0 0 24px 24px;
  }

  .meta-top {
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 1.2rem;
  }

  .title {
    font-size: 1.8rem;
    margin-bottom: 0.6rem;
  }

  .desc {
    font-size: 0.95rem;
    margin: 0.6rem auto;
  }

  .meta-bottom {
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 1.2rem;
    padding-top: 1.2rem;
  }

  .meta-divider {
    display: none;
  }
}
</style> 
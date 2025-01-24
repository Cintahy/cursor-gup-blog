<template>
  <footer class="post-footer">
    <div class="post-copyright">
      <div class="copyright-item">
        <span class="label">本文作者：</span>
        <span class="info">{{ frontmatter.author || site.title }}</span>
      </div>
      <div class="copyright-item">
        <span class="label">发布时间：</span>
        <span class="info">{{ formatDate(frontmatter.date) }}</span>
      </div>
      <div class="copyright-item">
        <span class="label">最后更新：</span>
        <span class="info">{{ formatDate(frontmatter.lastUpdated || frontmatter.date) }}</span>
      </div>
      <div class="copyright-item">
        <span class="label">原文链接：</span>
        <span class="info">
          <a :href="pageUrl" target="_blank">{{ pageUrl }}</a>
        </span>
      </div>
      <div class="copyright-item">
        <span class="label">许可协议：</span>
        <span class="info">
          <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank">
            CC BY-NC-SA 4.0
          </a>
        </span>
      </div>
    </div>

    <div class="share-section">
      <div class="share-title">分享文章</div>
      <BlogShare />
    </div>

    <nav class="post-nav">
      <div class="nav-item prev" v-if="prevPost">
        <a :href="prevPost.path">
          <div class="nav-arrow">
            <i class="iconfont icon-arrow-left"></i>
            <span>上一篇</span>
          </div>
          <div class="nav-title">{{ prevPost.title }}</div>
        </a>
      </div>
      <div class="nav-item next" v-if="nextPost">
        <a :href="nextPost.path">
          <div class="nav-arrow">
            <span>下一篇</span>
            <i class="iconfont icon-arrow-right"></i>
          </div>
          <div class="nav-title">{{ nextPost.title }}</div>
        </a>
      </div>
    </nav>
  </footer>
</template>

<script setup lang="ts">
import { formatDate } from '../../utils'
import BlogShare from '../BlogShare.vue'

defineProps<{
  frontmatter: any
  site: any
  pageViews: number
  readingTime: number
  pageUrl: string
  prevPost: any
  nextPost: any
}>()
</script>

<style scoped>
.post-footer {
  margin-top: 4rem;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 2rem;
}

.post-copyright {
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.copyright-item {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.copyright-item:last-child {
  margin-bottom: 0;
}

.label {
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.info {
  color: var(--vp-c-text-1);
}

.info a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.info a:hover {
  text-decoration: underline;
}

.share-section {
  margin: 2rem 0;
  text-align: center;
}

.share-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 1rem;
}

.post-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.nav-item a {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  transition: all 0.3s;
}

.nav-item a:hover {
  background: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

.nav-arrow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.nav-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.next {
  text-align: right;
}

.next .nav-arrow {
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .post-footer {
    margin-top: 3rem;
    padding-top: 1.5rem;
  }

  .post-nav {
    grid-template-columns: 1fr;
  }

  .next {
    text-align: left;
  }

  .next .nav-arrow {
    justify-content: flex-start;
  }
}
</style> 
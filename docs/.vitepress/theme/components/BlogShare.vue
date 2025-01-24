<template>
  <div class="blog-share">
    <button 
      v-for="item in shareItems" 
      :key="item.type"
      class="share-button"
      :class="item.type"
      :title="item.title"
      @click="share(item)"
    >
      <i :class="item.icon"></i>
      <span class="share-text">{{ item.text }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page, frontmatter } = useData()

// 当前页面URL
const currentUrl = computed(() => {
  if (typeof window === 'undefined') return ''
  return window.location.href
})

// 分享标题
const shareTitle = computed(() => {
  return frontmatter.value.title || page.value.title || '分享文章'
})

// 分享选项
const shareItems = [
  {
    type: 'weibo',
    title: '分享到微博',
    text: '微博',
    icon: 'iconfont icon-weibo',
    url: (title: string, url: string) => 
      `http://service.weibo.com/share/share.php?url=${url}&title=${title}`
  },
  {
    type: 'twitter',
    title: '分享到 Twitter',
    text: 'Twitter',
    icon: 'iconfont icon-twitter',
    url: (title: string, url: string) => 
      `https://twitter.com/intent/tweet?text=${title}&url=${url}`
  },
  {
    type: 'copy',
    title: '复制链接',
    text: '复制链接',
    icon: 'iconfont icon-link'
  }
]

// 分享处理函数
function share(item: typeof shareItems[0]) {
  const url = encodeURIComponent(currentUrl.value)
  const title = encodeURIComponent(shareTitle.value)
  
  if (item.type === 'copy') {
    // 复制链接
    navigator.clipboard.writeText(currentUrl.value)
      .then(() => {
        alert('链接已复制')
      })
      .catch(() => {
        alert('复制失败')
      })
    return
  }

  const shareUrl = item.url?.(title, url)
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'width=600,height=500')
  }
}
</script>

<style scoped>
.blog-share {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--vp-transition-duration);
}

.share-button:hover {
  background: var(--vp-c-bg-mute);
  transform: translateY(-2px);
}

.share-button i {
  font-size: 1.2rem;
}

/* 社交平台特定颜色 */
.share-button.weibo:hover {
  color: #e6162d;
}

.share-button.twitter:hover {
  color: #1da1f2;
}

.share-button.copy:hover {
  color: var(--vp-c-brand);
}

/* 深色模式优化 */
:root.dark .share-button {
  background: rgba(255, 255, 255, 0.1);
}

:root.dark .share-button:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .share-text {
    display: none;
  }
  
  .share-button {
    padding: 0.5rem;
  }
}
</style> 